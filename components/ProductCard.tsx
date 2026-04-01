import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/data-loader";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  onClick?: (product: Product) => void;
}

export function ProductCard({ product, priority = false, onClick }: ProductCardProps) {
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100,
  );

  // Elite Pricing Logic: Check if there are variants with different prices
  const variants = (product as any).variantes || [];
  const prices = variants.map((v: any) => Number(v.price)).filter((p: number) => !isNaN(p) && p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : product.price;
  const hasPriceVariation = prices.length > 1 && Math.max(...prices) !== Math.min(...prices);

  const content = (
    <>
      <div
        className="relative w-full overflow-hidden bg-white flex items-center justify-center"
        style={{
          aspectRatio: (product.collection?.toLowerCase().includes('fragrance') || product.collection?.toLowerCase().includes('offer'))
            ? '4/4'
            : '4/5'
        }}
      >
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-black/90 text-white text-[9px] font-black px-2 py-1 uppercase tracking-luxury">
            -{discount}% OFF
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow bg-black/40">
        <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-luxury whitespace-nowrap truncate text-white/90 group-hover:text-white transition-colors duration-300 min-h-[40px] leading-relaxed">
          {product.title}
        </h3>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex justify-between items-center w-full gap-3">
            <span className="text-sm md:text-lg  text-white/40 line-through">
              £{product.originalPrice.toFixed(2)}
            </span>
            <span className="text-[10px] md:text-xl font-bold text-white">
              {hasPriceVariation && <span className="text-[10px] md:text-xs text-accent mr-1 tracking-luxury uppercase font-black italic">From</span>}
              £{minPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </>
  );

  const baseClassName = "group flex flex-col bg-card/50 overflow-hidden transition-all duration-500 hover:bg-[#1a1a19] no-underline cursor-pointer border border-white/10";

  if (onClick) {
    return (
      <div
        onClick={() => onClick(product)}
        className={baseClassName}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/product/${product.handle}`}
      className={baseClassName}
    >
      {content}
    </Link>
  );
}
