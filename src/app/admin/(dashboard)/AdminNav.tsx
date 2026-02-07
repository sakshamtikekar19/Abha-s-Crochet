'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminNav() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <nav className="bg-amber-800 text-white py-2 px-4 shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex gap-6">
          <Link href="/admin/products" className="text-sm hover:underline">
            Products
          </Link>
          <Link href="/admin/orders" className="text-sm hover:underline">
            Orders
          </Link>
          <Link href="/" className="text-sm hover:underline opacity-80">
            ← Store
          </Link>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm hover:underline opacity-90"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
