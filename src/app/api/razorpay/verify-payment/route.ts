import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendOrderNotificationEmail } from '@/lib/send-order-email';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

// Uses RAZORPAY_KEY_SECRET (test or live – must match the key used in create-order).
export async function POST(request: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const supabase = createSupabaseAdminClient();

  if (!keySecret) {
    return NextResponse.json(
      { error: 'Razorpay is not configured' },
      { status: 500 }
    );
  }
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured. Add SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY to .env.local' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      product_id,
      product_name,
      amount_paise,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification fields' },
        { status: 400 }
      );
    }

    // Verify Razorpay signature
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('orders').insert({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      product_id: product_id || 'unknown',
      product_name: product_name || 'Product',
      amount_paise: amount_paise || 0,
      quantity: 1,
      status: 'paid',
      customer_name: customer_name || null,
      customer_email: customer_email || null,
      customer_phone: customer_phone || null,
      customer_address: customer_address || null,
    });

    if (error) {
      // Duplicate order_id is ok (idempotent)
      if (error.code === '23505') {
        return NextResponse.json({ success: true, message: 'Order already recorded' });
      }
      console.error('Supabase insert error:', error);
      return NextResponse.json(
        { error: 'Failed to save order' },
        { status: 500 }
      );
    }

    // Send order notification email to owner
    const ownerEmail = process.env.OWNER_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'Your Store';
    if (ownerEmail && !ownerEmail.includes('example')) {
      await sendOrderNotificationEmail(
        ownerEmail,
        {
          product_name: product_name || 'Product',
          amount_paise: amount_paise || 0,
          razorpay_order_id,
          razorpay_payment_id,
          customer_name: customer_name || undefined,
          customer_email: customer_email || undefined,
          customer_phone: customer_phone || undefined,
          customer_address: customer_address || undefined,
        },
        brandName
      );
    }

    return NextResponse.json({ success: true, message: 'Order saved' });
  } catch (err) {
    console.error('Verify payment error:', err);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}
