import Link from 'next/link';
import { useCart } from './CartContext';

export function SiteHeader() {
  const { items } = useCart()
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0)

  return (
    <header className="rounded-card border border-maroon/10 bg-cream p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-6">
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-[0.35em] text-gold">Chanchal Fashion</p>
        <h1 className="text-3xl font-serif font-semibold tracking-tight text-maroon-deep">Weave Your Own Story</h1>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:mt-0 sm:flex-row sm:items-center">
        <nav className="flex flex-wrap gap-2 text-sm font-medium text-ink">
          <Link href="/" className="rounded-chip border border-maroon/10 bg-white px-4 py-2 transition hover:border-maroon">Shop</Link>
          <Link href="/cart" className="rounded-chip border border-maroon/10 bg-white px-4 py-2 transition hover:border-maroon">Cart</Link>
        </nav>
        <div className="rounded-chip bg-gold-soft px-4 py-2 text-sm font-semibold text-maroon-deep">{totalQty} item{totalQty === 1 ? '' : 's'}</div>
      </div>
    </header>
  );
}
