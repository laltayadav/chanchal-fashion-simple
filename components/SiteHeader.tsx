import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="rounded-card border border-maroon/10 bg-cream p-6 shadow-sm md:flex md:items-center md:justify-between md:gap-6">
      <div className="space-y-2 py-1">
        <h1 className="brand-royal text-[2.15rem] font-bold tracking-[-0.015em] text-maroon-deep sm:text-[3.2rem]">Chanchal Fashion</h1>
        <p className="text-sm tracking-[0.14em] uppercase text-gold">Weave Your Own Story</p>
        <div className="mt-2 h-px w-40 bg-gradient-to-r from-gold/80 via-gold-soft to-transparent" />
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:mt-0 sm:flex-row sm:items-center">
        <nav className="flex flex-wrap gap-2 text-sm font-medium text-ink">
          <Link href="/" className="rounded-chip border border-maroon/10 bg-white px-4 py-2 transition hover:border-maroon">Shop</Link>
          <Link href="/cart" className="rounded-chip border border-maroon/10 bg-white px-4 py-2 transition hover:border-maroon">Cart</Link>
        </nav>
      </div>
    </header>
  );
}
