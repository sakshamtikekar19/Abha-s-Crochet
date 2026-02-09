import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Uses RAZORPAY_KEY_SECRET + NEXT_PUBLIC_RAZORPAY_KEY_ID (same for test or live – set live keys in env for production).
export async function POST(request: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json(
      { error: 'Razorpay is not configured' },
      { status: 500 }
    );
  }

  try {
    const { amount_paise, currency = 'INR', product_id, product_name } = await request.json();

    if (!amount_paise || amount_paise < 100) {
      return NextResponse.json(
        { error: 'Invalid amount (minimum ₹1)' },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: keySecret,
    });

    // Receipt must be max 40 characters
    const receiptId = String(product_id || Date.now()).slice(0, 32);
    const receipt = `cr_${receiptId}`;

    const order = await razorpay.orders.create({
      amount: amount_paise,
      currency,
      receipt,
      notes: product_name ? { product: product_name } : undefined,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
