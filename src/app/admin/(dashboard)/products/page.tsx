'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { value: 'bags', label: 'Bags' },
  { value: 'flowers', label: 'Flowers' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'baby', label: 'Baby' },
  { value: 'home', label: 'Home' },
] as const;

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price_paise: number;
  in_stock: boolean;
  sort_order: number;
}

const emptyForm = {
  name: '',
  category: 'bags',
  description: '',
  image: '',
  price_rupees: '',
  in_stock: true,
  sort_order: '0',
};

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const apiUrl = (path: string) => `/api/admin/products${path}`;

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(apiUrl(''), { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceRupees = parseFloat(form.price_rupees);
    if (isNaN(priceRupees) || priceRupees < 0) {
      setMessage({ type: 'error', text: 'Enter a valid price' });
      return;
    }
    const pricePaise = Math.round(priceRupees * 100);

    setLoading(true);
    setMessage(null);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        image: form.image.trim(),
        price_paise: pricePaise,
        in_stock: form.in_stock,
        sort_order: parseInt(form.sort_order, 10) || 0,
      };

      if (editingId) {
        const res = await fetch(apiUrl(`/${editingId}`), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
        setMessage({ type: 'success', text: 'Product updated!' });
        setEditingId(null);
      } else {
        const res = await fetch(apiUrl(''), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include',
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
        setMessage({ type: 'success', text: 'Product added!' });
      }

      setForm(emptyForm);
      fetchProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed' });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      image: p.image,
      price_rupees: (p.price_paise / 100).toString(),
      in_stock: p.in_stock,
      sort_order: String(p.sort_order),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this product? This cannot be undone.')) return;
    try {
      const res = await fetch(apiUrl(`/${id}`), {
        method: 'DELETE',
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Remove failed');
      setMessage({ type: 'success', text: 'Product removed' });
      if (editingId === id) cancelEdit();
      fetchProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Remove failed' });
    }
  };

  const formatPrice = (paise: number) => `₹${(paise / 100).toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            {editingId ? 'Edit Product' : 'Add Product'}
          </h1>
          <div className="flex gap-4">
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="text-sm text-amber-700 hover:underline"
              >
                Cancel edit
              </button>
            )}
            <Link href="/admin/orders" className="text-sm text-amber-700 hover:underline">
              View Orders →
            </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="e.g. Elegant Crochet Tote Bag"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="Describe your product..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price_rupees}
              onChange={(e) => setForm({ ...form, price_rupees: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="999.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
            <input
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              placeholder="0"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="in_stock"
              checked={form.in_stock}
              onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="in_stock" className="text-sm text-gray-700">
              In stock
            </label>
          </div>

          {message && (
            <p className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-amber-700 text-white rounded-md hover:bg-amber-800 disabled:opacity-60 font-medium"
          >
            {loading ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
          </button>
        </form>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">All Products</h2>
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={fetchProducts}
              className="px-3 py-1.5 text-sm bg-amber-100 text-amber-800 rounded hover:bg-amber-200"
            >
              Refresh
            </button>
          </div>

          {products.length === 0 && (
            <p className="text-gray-500 text-sm">No products yet. Add one above.</p>
          )}

          <div className="grid gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className={`flex gap-4 p-4 bg-white rounded-lg border ${
                  editingId === p.id ? 'border-amber-400 ring-2 ring-amber-200' : 'border-gray-200'
                }`}
              >
                <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-800 truncate">{p.name}</h3>
                  <p className="text-sm text-gray-500">
                    {CATEGORIES.find((c) => c.value === p.category)?.label || p.category} •{' '}
                    {formatPrice(p.price_paise)}
                    {!p.in_stock && ' • Out of stock'}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded hover:bg-amber-200"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                    title="Remove product"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Products appear on the{' '}
          <Link href="/collection" className="text-amber-700 hover:underline">
            Collection
          </Link>{' '}
          page.
        </p>
      </div>
    </div>
  );
}
