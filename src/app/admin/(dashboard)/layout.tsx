import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import AdminNav from './AdminNav';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    redirect('/admin/login');
  }

  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
