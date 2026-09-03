import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Eye, Check, Loader2 } from "lucide-react";
import { getImageUrl } from "../../utils/image";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  stock: number;
  featured?: boolean;
  badge?: string;
  image_url?: string;
  category?: { name: string } | string;
  slug?: string;
}

type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => Promise<void> | void;
};

function getCategoryName(cat: Product["category"]): string {
  if (!cat) return "";
  if (typeof cat === "string") return cat;
  return cat.name;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [cartState, setCartState] = useState<"idle" | "loading" | "success">("idle");

  const isOutOfStock = product.stock <= 0;
  const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const categoryName = getCategoryName(product.category);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onAddToCart || cartState !== "idle") return;

    setCartState("loading");
    try {
      await onAddToCart(product);
      setCartState("success");
      setTimeout(() => setCartState("idle"), 2200);
    } catch {
      setCartState("idle");
    }
  };

  const categoryEmoji = categoryName.toLowerCase().includes("cereal")
    ? "🌾"
    : categoryName.toLowerCase().includes("grain")
    ? "🍃"
    : "🌳";

  return (
    <article className="natura-card group flex flex-col h-full relative">

      {/* ── IMAGE ── */}
      <Link
        to={`/product/${product.id}`}
        className="relative block overflow-hidden"
        style={{ aspectRatio: "4/3" }}
        tabIndex={0}
        aria-label={`View ${product.name}`}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#F2EBDC] to-[#E9E1D0]">
          {product.image_url ? (
            <img
              src={getImageUrl(product.image_url)}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="text-[5rem] opacity-80 drop-shadow-md transition-transform duration-500 group-hover:scale-110">
              {categoryEmoji}
            </div>
          )}
        </div>

        {/* Badge overlays */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          {product.featured && (
            <span className="product-tag text-[#3B6E4C] text-[0.7rem]">Best Seller</span>
          )}
          {product.badge && (
            <span className="product-tag text-[#E88D36] text-[0.7rem]">{product.badge}</span>
          )}
          {isOutOfStock && (
            <span className="product-tag bg-[#2C221E]/80 text-white text-[0.7rem]">Sold Out</span>
          )}
        </div>

        {/* Hover quick-view overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#2C221E]/8">
          <span className="nav-pill bg-white text-[#2C221E] shadow-lg flex items-center gap-2 translate-y-3 group-hover:translate-y-0 transition-transform duration-300 font-semibold text-sm border border-[#E5DCDB]">
            <Eye size={15} /> Quick View
          </span>
        </div>
      </Link>

      {/* ── CONTENT ── */}
      <div className="flex flex-col flex-1 p-5 bg-white">

        {/* Category label */}
        <p className="text-[0.72rem] font-bold uppercase tracking-widest text-[#E88D36] mb-2">
          {categoryName}
        </p>

        {/* Product name */}
        <Link to={`/product/${product.id}`}>
          <h3
            className="text-[1rem] font-bold text-[#2C221E] hover:text-[#3B6E4C] transition-colors leading-tight mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-[0.8rem] text-[#685B55] line-clamp-2 leading-relaxed mt-1 mb-3">
            {product.description}
          </p>
        )}

        {/* Price + Add to Cart */}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-[#F2EBDC]">
          <span className="text-xl font-bold text-[#2C221E]">
            ₹{price.toLocaleString("en-IN")}
          </span>

          <button
            type="button"
            disabled={isOutOfStock || cartState === "loading"}
            onClick={handleAddToCart}
            aria-label={
              isOutOfStock
                ? "Sold out"
                : cartState === "success"
                ? "Added to cart"
                : `Add ${product.name} to cart`
            }
            className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
              cartState === "success"
                ? "bg-[#3B6E4C] text-white shadow-md shadow-[#3B6E4C]/30"
                : isOutOfStock
                ? "bg-[#F2EBDC] text-[#A8988E] cursor-not-allowed opacity-60"
                : "bg-[#FAF6EE] border border-[#E5DCDB] text-[#2C221E] hover:bg-[#3B6E4C] hover:border-[#3B6E4C] hover:text-white hover:shadow-md hover:shadow-[#3B6E4C]/25"
            }`}
          >
            {cartState === "loading" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : cartState === "success" ? (
              <Check size={16} strokeWidth={2.5} />
            ) : (
              <ShoppingBag size={16} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}