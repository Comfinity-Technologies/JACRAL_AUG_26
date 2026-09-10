import type { Product } from "../../types/product";
import { Heart, Leaf, ShoppingBag, Star, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { getImageUrl } from "../../utils/image";
import { useCart } from "../../hooks/useCart";

export type ProductCardItem = Product | {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  discount_price?: number | string | null;
  stock: number;
  featured?: boolean;
  badge?: string;
  image_url?: string | null;
  hover_image_url?: string | null;
  category?: any;
  slug?: string;
  is_active?: boolean;
};

export interface ProductCardProps {
  product: ProductCardItem;
  onAddToCart?: () => Promise<void> | void;
  variant?: "default" | "featured";
}

export default function ProductCard({
  product,
  onAddToCart,
  variant = "default",
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const primaryImage = product.image_url
    ? getImageUrl(product.image_url)
    : null;

  const hoverImage = product.hover_image_url
    ? getImageUrl(product.hover_image_url)
    : null;

  const isOutOfStock = Number(product.stock) <= 0;
  const productUrl = `/product/${product.id}`;

  const price = Number(product.price);
  const discountPrice =
    (product as any).discount_price != null
      ? Number((product as any).discount_price)
      : null;
  const hasDiscount = discountPrice != null && discountPrice < price;
  const discountPct = hasDiscount
    ? Math.round(((price - discountPrice!) / price) * 100)
    : 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    if (onAddToCart) {
      await onAddToCart();
    } else {
      await addToCart(product.id, 1);
    }
  };

  if (variant === "featured") {
    return (
      <article
        className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[#E6DFC7] bg-[#FAF6ED] p-4 transition-all duration-300 hover:shadow-[0_20px_45px_rgba(40,60,30,0.12)] sm:p-5"
        style={{
          boxShadow: "0 10px 30px rgba(40, 60, 30, 0.07)",
        }}
      >
        {/* ============================================================
            IMAGE ZONE — rounded cream container with badge
            ============================================================ */}
        <Link
          to={productUrl}
          className="relative block w-full overflow-hidden rounded-[20px]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          tabIndex={-1}
        >
          <div
            className="relative flex aspect-[4/3.8] w-full items-center justify-center overflow-hidden rounded-[20px]"
            style={{
              background:
                "linear-gradient(160deg, #FBF7EE 0%, #F5EEDB 55%, #EBE1CB 100%)",
            }}
          >
            {/* Top-left pill badge: leaf icon + product.badge or JACRAL OATS */}
            <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-1.5 rounded-full bg-[#D7E6D9] px-3 py-1.5 shadow-sm">
              <Leaf size={12} strokeWidth={2.2} className="text-[#28543C]" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#28543C]">
                {product.badge || "JACRAL OATS"}
              </span>
            </div>

            {primaryImage ? (
              <div className="relative flex h-full w-full items-center justify-center p-3">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className={`h-full w-full object-contain transition-opacity duration-500 ease-in-out ${
                    hovered && hoverImage ? "opacity-0" : "opacity-100"
                  }`}
                />
                {hoverImage && (
                  <img
                    src={hoverImage}
                    alt={product.name}
                    className={`absolute inset-0 m-auto h-full w-full object-contain transition-opacity duration-500 ease-in-out ${
                      hovered ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
              </div>
            ) : (
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full text-white"
                style={{ background: "linear-gradient(135deg, #28543C, #1E3D28)" }}
              >
                <Leaf size={36} strokeWidth={1.4} />
              </div>
            )}
          </div>
        </Link>

        {/* ============================================================
            CONTENT ZONE — label, title, description, buttons (NO PRICE)
            ============================================================ */}
        <div className="flex flex-1 flex-col pt-4 sm:pt-5">
          {/* Sub-label */}
          <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#A66B38]">
            <span>—</span>
            <span>{product.badge || "JACRAL OATS"}</span>
          </div>

          {/* Product Name */}
          <Link to={productUrl} className="no-underline">
            <h3
              className="mb-2 text-[22px] font-black uppercase leading-tight text-[#28543C] transition-colors group-hover:text-[#1F462D] sm:text-[26px]"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                letterSpacing: "-0.02em",
              }}
            >
              {product.name}
            </h3>
          </Link>

          {/* Product Description */}
          <p className="mb-5 line-clamp-2 min-h-[40px] text-[13px] leading-relaxed text-[#5A524A] sm:text-[14px]">
            {product.description ||
              "Wholesome oats blended with 100% natural ingredients for a healthy delicious treat."}
          </p>

          {/* Action Buttons Row — DETAILS + SHOP NOW */}
          <div className="mt-auto flex items-center gap-3 pt-2">
            <Link
              to={productUrl}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full border-[1.5px] border-[#28543C] bg-[#FAF6ED] px-4 py-2.5 text-center text-[11px] font-extrabold uppercase tracking-wider text-[#28543C] transition-all duration-200 hover:scale-[1.02] hover:bg-[#F0E8D0] active:scale-[0.98] sm:text-[12px]"
            >
              <span>DETAILS</span>
              <span className="text-sm">→</span>
            </Link>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#84B440] px-4 py-2.5 text-center text-[11px] font-black uppercase tracking-wider text-black shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-[#75A236] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-[12px]"
            >
              <ShoppingBag size={14} strokeWidth={2.4} className="text-black" />
              <span className="text-black font-black">{isOutOfStock ? "SOLD OUT" : "SHOP NOW"}</span>
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <>
      <style>{`
        @keyframes pcFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pcBadgePop {
          0%   { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1);   opacity: 1; }
        }
        .pc-card       { animation: pcFadeUp .5s cubic-bezier(.22,1,.36,1) both; }
        .pc-badge-pop  { animation: pcBadgePop .4s cubic-bezier(.22,1,.36,1) both; }
        @media (prefers-reduced-motion: reduce) {
          .pc-card, .pc-badge-pop { animation: none !important; }
        }
      `}</style>

      <article
        className="pc-card group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-[#E5DCDB] bg-white transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(60,40,20,0.12)]"
        style={{ boxShadow: "0 4px 16px rgba(60,40,20,0.06)" }}
      >
        {/* ============================================================
            IMAGE ZONE — contained image on a soft blending background
            ============================================================ */}
        <Link
          to={productUrl}
          className="relative block"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            className="relative flex aspect-[4/3.4] items-center justify-center overflow-hidden"
            style={{
              background:
                "linear-gradient(160deg, #FBF6EC 0%, #F2EBDC 55%, #E9E0CB 100%)",
            }}
          >
            {primaryImage ? (
              <img
                src={hovered && hoverImage ? hoverImage : primaryImage}
                alt={product.name}
                className="h-[82%] w-[82%] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.05]"
              />
            ) : (
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full text-white"
                style={{ background: "linear-gradient(135deg, #315E42, #1E3D28)" }}
              >
                <Leaf size={36} strokeWidth={1.2} />
              </div>
            )}

            {/* Badge — top-left */}
            <div className="pc-badge-pop absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 shadow-sm">
              {hasDiscount ? (
                <span className="text-[11px] font-bold uppercase tracking-wide text-[#C04422]">
                  -{discountPct}% off
                </span>
              ) : (
                <>
                  <Leaf size={11} strokeWidth={1.8} className="text-[#315E42]" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#315E42]">
                    {product.badge || "Jacral"}
                  </span>
                </>
              )}
            </div>

            {/* Wishlist — top-right */}
            <button
              type="button"
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setWishlisted((w) => !w);
              }}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#28221D] shadow-sm transition-transform hover:scale-105"
            >
              <Heart
                size={16}
                className={wishlisted ? "fill-[#C04422] text-[#C04422]" : "text-[#28221D]"}
              />
            </button>
          </div>
        </Link>

        {/* ============================================================
            CONTENT ZONE
            ============================================================ */}
        <div className="flex flex-1 flex-col p-5">
          <Link to={productUrl} className="no-underline">
            <h3 className="mb-1 text-[17px] font-bold leading-snug text-[#28221D] transition-colors group-hover:text-[#315E42]">
              {product.name}
            </h3>
          </Link>

          <p className="mb-3 line-clamp-1 text-[13px] text-[#847A70]">
            {product.description}
          </p>

          {/* Meta row — rating + shipping, matches reference layout */}
          <div className="mb-3 flex items-center gap-3 text-[13px] text-[#4D7A52]">
            <span className="flex items-center gap-1 font-semibold text-[#28221D]">
              <Star size={14} className="fill-[#E5A832] text-[#E5A832]" />
              4.5
            </span>
            <span className="text-[#D8CDBA]">•</span>
            <span className="flex items-center gap-1">
              <Truck size={14} />
              Fast shipping
            </span>
          </div>

          {/* Price row */}
          <div className="mt-auto flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              {hasDiscount && (
                <span className="text-[13px] text-[#B4A99B] line-through">
                  ₹{price}
                </span>
              )}
              <span className="text-[19px] font-extrabold text-[#28221D]">
                ₹{hasDiscount ? discountPrice : price}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: isOutOfStock
                  ? "#D1C7BA"
                  : "linear-gradient(135deg, #E88D36 0%, #C96A1F 100%)",
                boxShadow: isOutOfStock
                  ? "none"
                  : "0 8px 18px rgba(200,100,20,0.32)",
              }}
              onMouseEnter={(e) => {
                if (!isOutOfStock) e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
              }}
            >
              <ShoppingBag size={16} />
            </button>
          </div>

          {isOutOfStock && (
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-[#A15E4B]">
              Currently unavailable
            </p>
          )}
        </div>
      </article>
    </>
  );
}