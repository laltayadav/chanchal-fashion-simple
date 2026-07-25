import Link from 'next/link';

const featuredProducts = [
  { id: 1, name: 'Banarasi Silk', price: '₹3,800' },
  { id: 2, name: 'Kanjivaram Weave', price: '₹4,500' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50 p-8 text-stone-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-700">Chanchal Fashion</p>
            <h1 className="text-3xl font-semibold">Curated saris for everyday elegance</h1>
          </div>
          <nav className="flex gap-4 text-sm font-medium">
            <Link href="/cart" className="rounded-full bg-stone-900 px-4 py-2 text-white">Cart</Link>
            <Link href="/admin" className="rounded-full border border-stone-300 px-4 py-2">Admin</Link>
          </nav>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-stone-500">Launch ready</p>
            <h2 className="mb-4 text-2xl font-semibold">A simple store foundation is now in place.</h2>
            <p className="max-w-2xl text-stone-600">
              This starter shell includes the storefront, cart, admin pages, and API placeholders for products, orders, and config.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-amber-50 p-8 shadow-sm">
            <h3 className="mb-4 font-semibold">Featured products</h3>
            <ul className="space-y-3">
              {featuredProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                  <span>{product.name}</span>
                  <span className="font-medium">{product.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
