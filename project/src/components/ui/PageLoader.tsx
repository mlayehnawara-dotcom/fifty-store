interface PageLoaderProps {
  active: boolean;
}

export default function PageLoader({ active }: PageLoaderProps) {
  return (
    <div
      aria-hidden={!active}
      className={`pointer-events-none fixed inset-x-0 top-0 z-[70] h-1 overflow-hidden transition-opacity duration-200 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="h-full w-full bg-gradient-to-r from-fuchsia-500 via-orange-400 to-rose-500 animate-pulse" />
    </div>
  );
}
