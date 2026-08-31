import ProductCard from "./ProductCard";
import type { Product } from "../../data/products";

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({
  products,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="rounded-3xl border border-[#E5E0D5] bg-white p-12 text-center">
        <h3 className="font-serif text-2xl text-[#17382B]">
          No products found
        </h3>

        <p className="mt-3 text-[#718078]">
          We couldn't find any products matching your selection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}