import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { products } from "../../data/products";

export default function ProductPage() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FCFAF4] px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C98B4A]">
            PRODUCT
          </p>

          <h1 className="mt-4 font-serif text-5xl text-[#17382B]">
            Product not found
          </h1>

          <p className="mt-4 text-[#718078]">
            The product you are looking for could not be found.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#17382B] px-7 py-4 font-semibold text-white"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-[#FCFAF4] px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#17382B]"
        >
          <ArrowLeft size={17} />
          Back to Shop
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          {/* IMAGE AREA */}
          <div className="flex min-h-[520px] items-center justify-center rounded-[3rem] bg-[#E9E1D0]">
            <div className="text-center">
              <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-full bg-[#17382B] text-8xl">
                {product.category === "Jackfruit"
                  ? "🌳"
                  : "🌾"}
              </div>

              <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-[#C98B4A]">
                {product.category}
              </p>
            </div>
          </div>

          {/* PRODUCT INFORMATION */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C98B4A]">
              {product.category}
            </p>

            <h1 className="mt-4 font-serif text-5xl text-[#17382B] md:text-6xl">
              {product.name}
            </h1>

            {product.badge && (
              <span className="mt-5 w-fit rounded-full bg-[#F3E8D8] px-4 py-2 text-sm font-semibold text-[#17382B]">
                {product.badge}
              </span>
            )}

            <p className="mt-7 text-3xl font-semibold text-[#17382B]">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <p className="mt-6 max-w-xl text-lg leading-8 text-[#718078]">
              {product.description}
            </p>

            <div className="mt-8 rounded-2xl border border-[#E5E0D5] bg-white p-5">
              <p className="text-sm font-semibold text-[#17382B]">
                Availability
              </p>

              <p className="mt-2 text-sm text-[#718078]">
                {isOutOfStock
                  ? "Currently out of stock."
                  : `${product.stock} units currently available.`}
              </p>
            </div>

            <button
              type="button"
              disabled={isOutOfStock}
              className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-[#17382B] px-8 py-4 font-semibold text-white transition hover:bg-[#285642] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingBag size={19} />
              {isOutOfStock ? "Sold Out" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}