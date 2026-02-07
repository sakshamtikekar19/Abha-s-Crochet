'use client';

import { useCallback, useState } from 'react';
import { config } from '@/lib/config';
import type { Product } from '@/lib/products';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: { name?: string; email?: string; contact?: string };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: () => void) => void;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface RazorpayCheckoutProps {
  product: Product;
  onSuccess?: (paymentId: string) => void;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function RazorpayCheckout({
  product,
  onSuccess,
  onClose,
  className = '',
  children,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CustomerDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const proceedToPayment = useCallback(
    async (customer: CustomerDetails) => {
      if (!config.razorpay.keyId) {
        window.open(
          config.whatsapp.getHrefWithMessage(`Hi! I'm interested in ${product.name}`),
          '_blank'
        );
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount_paise: product.price_paise || 99900,
            product_id: String(product.id),
            product_name: product.name,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create order');

        if (typeof window === 'undefined' || !window.Razorpay) {
          await loadRazorpayScript();
        }
        if (!window.Razorpay) {
          throw new Error('Razorpay script failed to load');
        }

        const rzp = new window.Razorpay({
          key: config.razorpay.keyId,
          amount: data.amount,
          currency: data.currency || 'INR',
          name: config.brand.name,
          description: product.name,
          order_id: data.orderId,
          prefill: {
            name: customer.name,
            email: customer.email,
            contact: customer.phone,
          },
          handler: async (response: RazorpayResponse) => {
            setLoading(false);
            setShowForm(false);
            try {
              await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  product_id: String(product.id),
                  product_name: product.name,
                  amount_paise: product.price_paise || 99900,
                  customer_name: customer.name,
                  customer_email: customer.email,
                  customer_phone: customer.phone,
                  customer_address: customer.address,
                }),
              });
            } catch (e) {
              console.error('Failed to save order:', e);
            }
            onSuccess?.(response.razorpay_payment_id);
          },
        });

        rzp.on('payment.failed', () => {
          setLoading(false);
        });
        rzp.on('payment.close', () => {
          setLoading(false);
        });

        rzp.open();
      } catch (err) {
        setLoading(false);
        console.error(err);
        window.open(
          config.whatsapp.getHrefWithMessage(`Hi! I'm interested in ${product.name}`),
          '_blank'
        );
      }
    },
    [product, onSuccess]
  );

  const handleBuyClick = () => {
    if (!config.razorpay.keyId) {
      window.open(
        config.whatsapp.getHrefWithMessage(`Hi! I'm interested in ${product.name}`),
        '_blank'
      );
      return;
    }
    setShowForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()) {
      return;
    }
    proceedToPayment(form);
  };

  return (
    <>
      <button
        onClick={handleBuyClick}
        disabled={loading}
        className={className || 'btn-primary w-full'}
      >
        {loading ? 'Opening...' : children || 'Buy Now'}
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Delivery Details</h3>
              <p className="text-sm text-gray-500 mb-4">
                We need your details to deliver <strong>{product.name}</strong>
              </p>
              <p className="text-amber-700 text-sm font-medium mb-4">
                Estimated delivery: 7–8 business days
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="House no., Street, City, State, Pincode"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 px-4 bg-amber-700 text-white rounded-md hover:bg-amber-800 disabled:opacity-60"
                  >
                    {loading ? 'Opening...' : 'Proceed to Payment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
}
