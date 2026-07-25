type OrderCardProps = {
  orderId: string;
  status: string;
};

export function OrderCard({ orderId, status }: OrderCardProps) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm uppercase tracking-[0.2em] text-stone-500">Order</p>
      <h3 className="mt-2 font-semibold">{orderId}</h3>
      <p className="mt-2 text-sm text-stone-600">Status: {status}</p>
    </div>
  );
}
