'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Order {
  id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  product_id: string;
  product_name: string;
  amount_paise: number;
  quantity: number;
  status: string;
  customer_email?: string;
  customer_phone?: string;
  customer_name?: string;
  customer_address?: string;
  created_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders', { credentials: 'include' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Error ${res.status}`);
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatDate = (s: string) => new Date(s).toLocaleString();
  const formatAmount = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
          <Link href="/admin/products" className="text-sm text-amber-700 hover:underline">
            Manage Products →
          </Link>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="mb-6 px-4 py-2 bg-amber-700 text-white rounded-md hover:bg-amber-800 disabled:opacity-60 text-sm"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        {orders.length === 0 && !loading && !error && (
          <p className="text-gray-500">No orders yet.</p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Delivery Address</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Payment ID</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatDate(o.created_at)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {o.product_name}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div>
                      {o.customer_name || '-'}
                      {o.customer_phone && (
                        <div className="text-xs text-gray-500">{o.customer_phone}</div>
                      )}
                      {o.customer_email && (
                        <div className="text-xs text-gray-500">{o.customer_email}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-[200px]">
                    {o.customer_address ? (
                      <span title={o.customer_address} className="line-clamp-2">
                        {o.customer_address}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{formatAmount(o.amount_paise)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        o.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : o.status === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                    {o.razorpay_payment_id || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
