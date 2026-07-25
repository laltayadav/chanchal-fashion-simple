type ProductCardProps = {
  name: string;
  price: string;
};

export function ProductCard({ name, price }: ProductCardProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold">{name}</h3>
      <p className="mt-2 text-sm text-stone-600">Handpicked sari with premium finish.</p>
      <p className="mt-4 font-semibold text-amber-700">{price}</p>
    </div>
  );
}
