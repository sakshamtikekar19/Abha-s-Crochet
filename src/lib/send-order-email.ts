import { Resend } from 'resend';

export interface OrderEmailData {
  product_name: string;
  amount_paise: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
}

export async function sendOrderNotificationEmail(
  to: string,
  order: OrderEmailData,
  brandName: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM || 'onboarding@resend.dev';

  if (!apiKey) {
    console.warn('RESEND_API_KEY not set - skipping order email');
    return false;
  }

  const amountRupees = (order.amount_paise / 100).toLocaleString('en-IN');

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Order</title></head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #b45309;">New order received</h2>
  <p>A new order has been placed on ${brandName}.</p>
  
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr style="background: #f5f5f5;"><td style="padding: 10px; font-weight: bold;">Product</td><td style="padding: 10px;">${order.product_name}</td></tr>
    <tr><td style="padding: 10px; font-weight: bold;">Amount</td><td style="padding: 10px;">₹${amountRupees}</td></tr>
    <tr style="background: #f5f5f5;"><td style="padding: 10px; font-weight: bold;">Payment ID</td><td style="padding: 10px; font-family: monospace;">${order.razorpay_payment_id}</td></tr>
    <tr><td style="padding: 10px; font-weight: bold;">Order ID</td><td style="padding: 10px; font-family: monospace;">${order.razorpay_order_id}</td></tr>
  </table>

  <h3 style="color: #333; margin-top: 24px;">Delivery details</h3>
  <table style="width: 100%; border-collapse: collapse;">
    <tr style="background: #f5f5f5;"><td style="padding: 10px; font-weight: bold;">Name</td><td style="padding: 10px;">${order.customer_name || '-'}</td></tr>
    <tr><td style="padding: 10px; font-weight: bold;">Email</td><td style="padding: 10px;">${order.customer_email || '-'}</td></tr>
    <tr style="background: #f5f5f5;"><td style="padding: 10px; font-weight: bold;">Phone</td><td style="padding: 10px;">${order.customer_phone || '-'}</td></tr>
    <tr><td style="padding: 10px; font-weight: bold;">Address</td><td style="padding: 10px; white-space: pre-wrap;">${order.customer_address || '-'}</td></tr>
  </table>

  <p style="margin-top: 24px; color: #666; font-size: 14px;">
    Estimated delivery: 7–8 business days
  </p>
</body>
</html>
`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `${brandName} <${from}>`,
      to: [to],
      subject: `New order: ${order.product_name} – ₹${amountRupees}`,
      html,
    });

    if (error) {
      console.error('Resend email error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to send order email:', err);
    return false;
  }
}
