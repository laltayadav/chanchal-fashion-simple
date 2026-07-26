import Link from 'next/link';
import { useCart } from './CartContext';

export function SiteHeader() {
  const { items } = useCart()
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0)

  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-amber-700">Chanchal Fashion</p>
        <h1 className="text-2xl font-semibold tracking-tight">Weave Your Own Story</h1>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <nav className="flex flex-wrap gap-2 text-sm font-medium">
          <Link href="/" className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 hover:border-amber-700">Shop</Link>
          <Link href="/cart" className="rounded-full border border-stone-200 bg-stone-50 px-3 py-2 hover:border-amber-700">Cart</Link>
        </nav>
        <div className="rounded-full bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900">
          Cart: {totalQty} item{totalQty === 1 ? '' : 's'}
        </div>
      </div>
    </header>
  );
}
