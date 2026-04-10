export function ScrollingText() {
  const text =
    "NORTH MIND | WINTER COLLECTION 2026 | BRITISH HERITAGE | PREMIUM QUALITY | ";
  return (
    <div className="bg-black overflow-hidden whitespace-nowrap py-3  select-none">
      <div className="inline-block animate-scroll">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className="text-white/80 font-bold text-xs uppercase tracking-widest px-4"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
