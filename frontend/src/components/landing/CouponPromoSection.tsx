import { useState, useEffect } from "react";
import { Tag, Copy, CheckCheck, ChevronRight, Sparkles } from "lucide-react";

interface CouponData {
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_order_amount: number;
  description?: string | null;
}

export default function CouponPromoSection() {
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/content/coupons")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: CouponData[]) => {
        if (Array.isArray(data)) setCoupons(data);
      })
      .catch(() => {});
  }, []);

  if (coupons.length === 0) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    });
  };

  const getDiscountLabel = (c: CouponData) => {
    if (c.discount_type === "percentage") return `${c.discount_value}% OFF`;
    return `₹${c.discount_value} OFF`;
  };

  const getSubtext = (c: CouponData) => {
    if (c.description) return c.description;
    if (c.minimum_order_amount > 0)
      return `On orders above ₹${c.minimum_order_amount}`;
    return "No minimum order required";
  };

  return (
    <section
      id="offers"
      className="py-16 md:py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#2C221E" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E88D36]/15 border border-[#E88D36]/30 text-[#E88D36] text-xs font-black uppercase tracking-widest">
            <Sparkles size={13} />
            <span>Exclusive Deals</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "Playfair Display, Cormorant Garamond, serif" }}
          >
            USE A COUPON &amp; SAVE
          </h2>
          <p className="text-sm text-white/60 font-medium">
            Apply these codes at checkout to unlock instant savings.
          </p>
        </div>

        {/* Coupon Cards */}
        <div
          className={`grid gap-5 ${
            coupons.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : coupons.length === 2
              ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {coupons.map((c) => {
            const isCopied = copiedCode === c.code;
            return (
              <div
                key={c.code}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #3D302B 0%, #2C221E 100%)",
                  border: "1px solid rgba(232,141,54,0.25)",
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, #E88D36, transparent)",
                  }}
                />

                <div className="p-6 flex flex-col gap-4">
                  {/* Discount badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-[#E88D36]/15 flex items-center justify-center">
                        <Tag size={17} className="text-[#E88D36]" />
                      </div>
                      <span
                        className="text-2xl font-black text-[#E88D36] tracking-tight"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        {getDiscountLabel(c)}
                      </span>
                    </div>
                  </div>

                  {/* Subtext */}
                  <p className="text-xs text-white/60 font-medium leading-snug">
                    {getSubtext(c)}
                  </p>

                  {/* Divider */}
                  <div
                    className="border-t border-dashed border-white/10"
                  />

                  {/* Code + Copy */}
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="font-mono text-lg font-black tracking-widest text-white bg-white/5 px-4 py-2 rounded-xl border border-white/10 flex-1 text-center"
                    >
                      {c.code}
                    </span>
                    <button
                      onClick={() => handleCopy(c.code)}
                      aria-label={`Copy coupon code ${c.code}`}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                        isCopied
                          ? "bg-[#3B6E4C] text-white"
                          : "bg-[#E88D36] text-white hover:bg-[#D47E2A] hover:scale-105"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <CheckCheck size={14} />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA to shop */}
        <div className="mt-10 text-center">
          <a
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#E88D36] hover:text-[#FFB800] transition-colors"
          >
            <span>Shop Now &amp; Apply Your Coupon</span>
            <ChevronRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
