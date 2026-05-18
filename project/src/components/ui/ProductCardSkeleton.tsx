export default function ProductCardSkeleton() {
  return (
    <article className="glass-card rounded-3xl p-4">
      <div className="skeleton aspect-square w-full rounded-2xl" />
      <div className="mt-4 space-y-3">
        <div className="skeleton h-3 w-20 rounded-full" />
        <div className="skeleton h-5 w-4/5 rounded-lg" />
        <div className="skeleton h-4 w-2/5 rounded-lg" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </article>
  );
}
