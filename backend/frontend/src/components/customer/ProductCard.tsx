import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import type { Product } from "../../data/products";

type ProductCardProps = {
  product: Product;
  onAddToCart?: (product: Product) => void;
};

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group overflow-hidden rounded-3xl border border-[#E5E0D5] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/product/${product.id}`}>
        <div className="flex h-64 items-center justify-center bg-[#F1EBDD]">
          <div className="px-6 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#17382B] text-3xl">
              {product.category === "Jackfruit" ? "🌳" : "🌾"}
            </div>

            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#718078]">
              {product.category}
            </p>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C98B4A]">
              {product.category}
            </p>

            <Link to={`/product/${product.id}`}>
              <h3 className="mt-2 text-xl font-semibold text-[#17382B] transition hover:text-[#C98B4A]">
                {product.name}
              </h3>
            </Link>
          </div>

          {product.badge && (
            <span className="rounded-full bg-[#F3E8D8] px-3 py-1 text-xs font-semibold text-[#17382B]">
              {product.badge}
            </span>
          )}
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#718078]">
          {product.description}
        </p>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-semibold text-[#17382B]">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-xs text-[#718078]">
              {isOutOfStock
                ? "Out of stock"
                : `${product.stock} available`}
            </p>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={() => onAddToCart?.(product)}
            className="inline-flex items-center gap-2 rounded-full bg-[#17382B] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#285642] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ShoppingBag size={16} />

            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}