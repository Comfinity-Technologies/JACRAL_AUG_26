import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  useCart,
} from "../../hooks/useCart";

export default function CartPage() {
  const {
    items,
    subtotal,
    delivery,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFAF4] px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <ShoppingBag
            size={56}
            strokeWidth={1.5}
            className="mx-auto text-[#C98B4A]"
          />

          <h1 className="mt-8 font-serif text-6xl text-[#17382B]">
            Your Cart
          </h1>

          <p className="mt-5 text-[#5F6F68]">
            Your cart is currently empty.
          </p>

          <Link
            to="/shop"
            className="mt-8 inline-block rounded-full bg-[#17382B] px-8 py-4 font-medium text-white transition hover:opacity-90"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFAF4] px-6 py-12">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12">
          <p className="text-sm font-semibold tracking-[0.25em] text-[#C98B4A]">
            YOUR BAG
          </p>

          <h1 className="mt-3 font-serif text-6xl text-[#17382B]">
            Your Cart
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* ITEMS */}
          <div className="rounded-3xl border border-[#E5E0D5] bg-white p-6 md:p-8">

            <div className="mb-8 border-b border-[#E8E3D9] pb-5">
              <h2 className="text-2xl font-semibold text-[#17382B]">
                Your Items
              </h2>

              <p className="mt-1 text-sm text-[#718078]">
                {items.length} product
                {items.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="space-y-7">

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 border-b border-[#E8E3D9] pb-7 last:border-0"
                >

                  {/* PRODUCT IMAGE */}
                  <div className="flex gap-5">

                    <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#F3EFE5]">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-xs tracking-widest text-[#9A9A88]">
                          PRODUCT
                        </span>
                      )}

                    </div>

                    <div className="flex-1">

                      <p className="text-xs font-semibold tracking-[0.2em] text-[#C98B4A]">
                        {item.category}
                      </p>

                      <h3 className="mt-2 text-xl font-semibold text-[#17382B]">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-[#718078]">
                        ₹{item.price}
                      </p>

                    </div>

                  </div>

                  {/* CONTROLS */}

                  <div className="flex items-center justify-between">

                    <div className="flex items-center rounded-full border border-[#DCD7CB]">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#F3EFE5]"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="w-10 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#F3EFE5]"
                      >
                        <Plus size={15} />
                      </button>

                    </div>

                    <div className="text-right">

                      <p className="font-semibold text-[#17382B]">
                        ₹{item.price * item.quantity}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        className="mt-2 inline-flex items-center gap-1 text-sm text-[#8A6B54] hover:text-[#17382B]"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>

            <Link
              to="/shop"
              className="mt-8 inline-block rounded-full border border-[#17382B] px-6 py-3 text-sm font-medium hover:bg-[#17382B] hover:text-white"
            >
              Continue Shopping
            </Link>

          </div>

          {/* SUMMARY */}

          <aside className="h-fit rounded-3xl bg-[#17382B] p-8 text-white">

            <h2 className="text-2xl font-semibold">
              Order Summary
            </h2>

            <div className="mt-8 space-y-5 border-b border-white/15 pb-6">

              <div className="flex justify-between text-sm text-white/75">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-sm text-white/75">
                <span>Delivery</span>

                <span>
                  {delivery === 0
                    ? "FREE"
                    : `₹${delivery}`}
                </span>
              </div>

            </div>

            <div className="flex justify-between py-6">

              <span className="text-lg">
                Total
              </span>

              <span className="text-2xl font-semibold">
                ₹{total}
              </span>

            </div>

            <Link
              to="/checkout"
              className="block rounded-full bg-[#C98B4A] px-6 py-4 text-center font-semibold text-white hover:opacity-90"
            >
              Proceed to Checkout
            </Link>

          </aside>

        </div>

      </div>
    </div>
  );
}