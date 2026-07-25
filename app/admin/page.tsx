import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-stone-50 p-8 text-stone-900">
      <div className="mx-auto max-w-4xl rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Admin dashboard</h1>
        <div className="mt-6 flex gap-4">
          <Link href="/admin/products" className="rounded-full bg-stone-900 px-4 py-2 text-white">Manage products</Link>
          <Link href="/admin/orders" className="rounded-full border border-stone-300 px-4 py-2">View orders</Link>
        </div>
      </div>
    </main>
  );
}
