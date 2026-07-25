import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Chanchal Fashion</p>
        <h1 className="text-2xl font-semibold">Simple sari boutique</h1>
      </div>
      <nav className="flex gap-3 text-sm font-medium">
        <Link href="/" className="rounded-full px-3 py-2 hover:bg-stone-100">Home</Link>
        <Link href="/cart" className="rounded-full px-3 py-2 hover:bg-stone-100">Cart</Link>
        <Link href="/admin" className="rounded-full px-3 py-2 hover:bg-stone-100">Admin</Link>
      </nav>
    </header>
  );
}
