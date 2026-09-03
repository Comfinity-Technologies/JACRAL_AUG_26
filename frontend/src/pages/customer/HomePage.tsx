import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductGrid from "../../components/customer/ProductGrid";
import { apiClient } from "../../api/client";
import {
  ArrowRight, Leaf, Truck, Shield, Package, Smile,
  Star, CheckCircle2, Sprout
} from "lucide-react";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [featRes, allRes, catRes] = await Promise.all([
          apiClient.get("/api/v1/products?limit=4&featured=true"),
          apiClient.get("/api/v1/products?limit=8"),
          apiClient.get("/api/v1/categories"),
        ]);
        setFeaturedProducts(featRes.data.items ?? []);
        setAllProducts(allRes.data.items ?? []);
        setCategories(catRes.data ?? []);
      } catch (e) {
        console.error("Products/categories fetch failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const displayFeatured =
    featuredProducts.length > 0 ? featuredProducts : allProducts.slice(0, 4);

  // Map backend categories to visual config
  const catVisuals: Record<string, { emoji: string; bg: string; tag: string; desc: string }> = {
    jackfruit: { emoji: "🌳", bg: "from-[#F5EDDB] to-[#EAD9BB]", tag: "Popular", desc: "Flour, seeds, and ready-to-eat natural jackfruit items." },
    cereal: { emoji: "🌾", bg: "from-[#E7EEE6] to-[#CFDECE]", tag: "Daily Needs", desc: "Nutritious millets, oats, and daily breakfast essentials." },
    cereals: { emoji: "🌾", bg: "from-[#E7EEE6] to-[#CFDECE]", tag: "Daily Needs", desc: "Nutritious millets, oats, and daily breakfast essentials." },
    grain: { emoji: "🍃", bg: "from-[#EBE8F5] to-[#D4CFE7]", tag: "Wholesome", desc: "Premium grains and seeds from trusted farms." },
    preserve: { emoji: "🍯", bg: "from-[#FCEFE3] to-[#F3D5B9]", tag: "New", desc: "Locally sourced honey and traditional fruit preserves." },
    honey: { emoji: "🍯", bg: "from-[#FCEFE3] to-[#F3D5B9]", tag: "Natural", desc: "Pure, raw honey from sustainable apiaries." },
  };

  const getVisual = (name: string) => {
    const key = name.toLowerCase().replace(/\s/g, "");
    for (const [k, v] of Object.entries(catVisuals)) {
      if (key.includes(k)) return v;
    }
    return { emoji: "🌿", bg: "from-[#E7EEE6] to-[#CFDECE]", tag: "Explore", desc: "Pure, natural goodness for your everyday health." };
  };

  // Use up to 3 categories from backend; fallback to hardcoded
  const displayCategories = categories.length > 0
    ? categories.slice(0, 3)
    : [
        { id: "j", name: "Jackfruit Products" },
        { id: "c", name: "Cereals" },
        { id: "g", name: "Grains" },
      ];

  return (
    <div className="bg-[#FAF6EE] text-[#2C221E] overflow-hidden">

      {/* ═══════════════════════════════════════════
          HERO — Natura Market Inspired
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden px-6 py-10 md:py-0">

        {/* Soft organic background blobs */}
        <div className="hero-blob bg-[#E88D36] w-[520px] h-[520px] -top-24 -left-28 opacity-10" />
        <div
          className="hero-blob bg-[#3B6E4C] w-[480px] h-[480px] bottom-0 -right-20 opacity-10"
          style={{ animationDelay: "2.5s" }}
        />

        <div className="relative mx-auto grid max-w-7xl w-full items-center gap-12 lg:grid-cols-2 lg:gap-20 py-12">

          {/* ─── LEFT: Editorial Copy ─── */}
          <div className="z-10 flex flex-col">

            {/* Organic brand badge */}
            <div className="fade-up-1 inline-flex items-center gap-2 self-start mb-8 rounded-full border border-[#3B6E4C]/25 bg-[#3B6E4C]/10 px-4 py-2 text-sm font-semibold text-[#3B6E4C]">
              <Leaf size={14} strokeWidth={2.2} />
              Naturally Good &nbsp;·&nbsp; From JACRAL
            </div>

            {/* Large serif headline — matches reference */}
            <h1
              className="fade-up-2 text-[3.2rem] leading-[1.08] md:text-[4.5rem] lg:text-[5rem] text-[#2C221E] mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Fresh From{" "}
              <span className="text-[#3B6E4C] italic">Nature,</span>
              <br />
              Delivered to You.
            </h1>

            {/* Body paragraph */}
            <p className="fade-up-3 max-w-md text-[1.05rem] leading-[1.8] text-[#685B55] mb-10">
              Discover premium jackfruit products and wholesome cereals, sourced
              directly from trusted farmers — for a healthier, happier you.
            </p>

            {/* CTA buttons — matches reference */}
            <div className="fade-up-4 flex flex-wrap items-center gap-4">
              <Link to="/shop" className="btn-primary rounded-full px-8 py-4 text-base shadow-lg">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/shop"
                className="btn-cta rounded-full px-8 py-4 text-base"
              >
                Explore Products <ArrowRight size={18} />
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="fade-up-5 mt-10 flex items-center gap-4">
              <div className="flex -space-x-2.5">
                {["JD", "SM", "AK", "RV"].map((initials, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-[#FAF6EE] bg-gradient-to-br from-[#E88D36]/40 to-[#3B6E4C]/40 flex items-center justify-center text-[10px] font-bold text-[#2C221E]"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className="fill-[#FFB800] text-[#FFB800]" />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#2C221E]">4.9/5</span>
                <span className="text-sm text-[#685B55]">· 5,000+ happy customers</span>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Hero Visual + Floating Cards ─── */}
          <div className="relative hidden lg:block">

            {/* Main hero food image */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#F0E9D8] via-[#EDE2C6] to-[#D8CDB8] min-h-[540px] flex items-center justify-center shadow-xl">
              <img
                src="/hero-food.png"
                alt="Premium jackfruit and cereal food composition"
                className="w-full h-[540px] object-cover object-center"
                loading="eager"
              />
              {/* Subtle overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2C221E]/10 to-transparent pointer-events-none rounded-[2.5rem]" />
            </div>

            {/* Floating card 1 — "100% Natural" (top-left, like reference) */}
            <div className="floating-card float-anim absolute -top-6 -left-10 flex items-center gap-3 px-4 py-3 z-20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B6E4C]/12 text-[#3B6E4C]">
                <Shield size={20} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[0.8rem] font-bold text-[#2C221E] leading-tight">100% Natural 🌿</p>
                <p className="text-[0.72rem] text-[#685B55]">No chemicals. No compromise.</p>
              </div>
            </div>

            {/* Floating card 2 — Same Day Delivery (bottom, like reference) */}
            <div className="floating-card float-anim-delayed absolute -bottom-6 -left-8 flex items-center gap-3 px-4 py-3 z-20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E88D36]/12 text-[#E88D36]">
                <Truck size={20} strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[0.8rem] font-bold text-[#2C221E] leading-tight">Fast Delivery 🚚</p>
                <p className="text-[0.72rem] text-[#685B55]">Freshness, delivered fast.</p>
              </div>
            </div>

            {/* Floating card 3 — Rating (top-right, like reference) */}
            <div className="floating-card absolute -top-2 -right-10 px-4 py-3 z-20 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFB800]/15 text-[#FFB800] flex-shrink-0">
                <Star size={18} className="fill-[#FFB800]" strokeWidth={0} />
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-[0.85rem] font-bold text-[#2C221E]">4.9/5</span>
                </div>
                <p className="text-[0.72rem] text-[#685B55]">12K Reviews</p>
              </div>
            </div>

            {/* Decorative leaf accents */}
            <div className="absolute top-14 right-2 text-4xl opacity-70 rotate-12 pointer-events-none select-none">🍃</div>
            <div className="absolute bottom-20 right-0 text-3xl opacity-60 -rotate-12 pointer-events-none select-none">🌿</div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST STRIP — Bottom of Hero (matches reference)
          ═══════════════════════════════════════════ */}
      <section className="px-6 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="trust-strip px-6 py-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                icon: <Leaf size={22} className="text-[#3B6E4C]" />,
                label: "100% Organic",
                sub: "Certified & natural produce",
                bg: "bg-[#3B6E4C]/10",
              },
              {
                icon: <Shield size={22} className="text-[#3B6E4C]" />,
                label: "Secure Payments",
                sub: "Safe & encrypted checkout",
                bg: "bg-[#3B6E4C]/10",
              },
              {
                icon: <Package size={22} className="text-[#E88D36]" />,
                label: "Quality Packaging",
                sub: "Eco-friendly & fresh",
                bg: "bg-[#E88D36]/10",
              },
              {
                icon: <Smile size={22} className="text-[#FFB800]" />,
                label: "Happy Customers",
                sub: "Trusted by thousands",
                bg: "bg-[#FFB800]/15",
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${item.bg}`}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-[0.83rem] font-bold text-[#2C221E] leading-tight">
                    {item.label}
                  </p>
                  <p className="text-[0.73rem] text-[#685B55] mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider !mt-0" />

      {/* ═══════════════════════════════════════════
          CATEGORIES — Dynamic from backend
          ═══════════════════════════════════════════ */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-14 gap-4">
            <div>
              <span className="section-eyebrow text-[#E88D36]">Curated Selections</span>
              <h2
                className="mt-3 text-4xl text-[#2C221E] md:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Shop by Category
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-[#2C221E] hover:text-[#E88D36] transition-colors border-b-2 border-transparent hover:border-[#E88D36] pb-1 self-end"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayCategories.map((cat: any) => {
              const visual = getVisual(cat.name);
              return (
                <Link
                  key={cat.id}
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="natura-card group flex flex-col overflow-hidden relative min-h-[300px]"
                  aria-label={`Browse ${cat.name}`}
                >
                  {/* Gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${visual.bg} opacity-60 group-hover:opacity-80 transition-opacity duration-400`}
                  />

                  <div className="relative z-10 flex flex-col h-full p-7">
                    {/* Icon + Tag row */}
                    <div className="flex justify-between items-start mb-auto">
                      <div className="text-5xl w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                        {visual.emoji}
                      </div>
                      <span className="text-[0.72rem] font-bold uppercase tracking-wider bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[#2C221E]">
                        {visual.tag}
                      </span>
                    </div>

                    <div className="mt-8">
                      <h3
                        className="text-2xl font-bold text-[#2C221E] mb-2"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {cat.name}
                      </h3>
                      <p className="text-[#685B55] text-sm leading-relaxed mb-5">
                        {visual.desc}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-[#3B6E4C] group-hover:translate-x-2 transition-transform">
                        Explore Range <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ═══════════════════════════════════════════
          FEATURED PRODUCTS — From backend
          ═══════════════════════════════════════════ */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="section-eyebrow text-[#E88D36]">Our Bestsellers</span>
            <h2
              className="mt-3 text-4xl text-[#2C221E] md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Customer Favorites
            </h2>
            <p className="mt-4 text-[#685B55] max-w-md mx-auto leading-relaxed">
              Handpicked by our customers — the most loved jackfruit and cereal products.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-[420px] rounded-[24px]" />
              ))}
            </div>
          ) : (
            <ProductGrid products={displayFeatured} cols={4} />
          )}

          <div className="mt-14 text-center">
            <Link
              to="/shop"
              className="btn-outline rounded-full px-10 py-4 text-base"
            >
              View Entire Catalog <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BRAND STORY / PROMO SECTION
          ═══════════════════════════════════════════ */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-7xl">
          <div
            className="natura-card !rounded-[2.5rem] !bg-[#3B6E4C] p-10 md:p-16 overflow-hidden relative"
            style={{ borderColor: "transparent" }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#FFB800]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
              {/* Left copy */}
              <div className="text-white">
                <span
                  className="text-[#FFB800] text-lg mb-4 block"
                  style={{ fontFamily: "var(--font-script)" }}
                >
                  The JACRAL Promise
                </span>
                <h2
                  className="text-4xl md:text-5xl mb-6 leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Ethically Sourced.
                  <br />
                  Naturally Prepared.
                </h2>
                <p className="text-white/80 text-[1.05rem] leading-[1.8] mb-8 max-w-md">
                  We believe in keeping food as close to its natural state as possible.
                  No artificial preservatives — pure, wholesome goodness delivered to your door.
                </p>

                <ul className="space-y-3 mb-10">
                  {[
                    "100% Organic Ingredients",
                    "Sourced from trusted local farmers",
                    "Eco-friendly, minimal packaging",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/90">
                      <CheckCircle2 size={18} className="text-[#FFB800] flex-shrink-0" />
                      <span className="font-medium text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/shop"
                  className="btn-cta rounded-full px-8 py-4 inline-flex !text-[#2C221E]"
                >
                  Discover Our Quality <ArrowRight size={18} />
                </Link>
              </div>

              {/* Right visual */}
              <div className="hidden md:flex justify-center relative">
                <div className="w-[360px] h-[440px] rounded-[36px] overflow-hidden shadow-2xl">
                  <img
                    src="/hero-food-2.png"
                    alt="JACRAL premium jackfruit and cereal products"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* Floating quality badge */}
                <div className="floating-card float-anim absolute -bottom-4 -left-8 flex items-center gap-3 px-4 py-3 z-20">
                  <div className="w-11 h-11 rounded-full bg-[#E88D36]/15 flex items-center justify-center text-[#E88D36]">
                    <Sprout size={22} />
                  </div>
                  <div>
                    <p className="text-[0.72rem] text-[#685B55] font-bold uppercase tracking-wider">Quality</p>
                    <p className="text-[1rem] font-bold text-[#2C221E]">Guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY JACRAL — Editorial trust section
          ═══════════════════════════════════════════ */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="section-eyebrow text-[#E88D36]">Why Choose Us</span>
            <h2
              className="mt-3 text-4xl text-[#2C221E] md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              From Farm to Your Table
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🌳",
                title: "Premium Jackfruit",
                desc: "Hand-selected, ripe jackfruit sourced from the lush farms of Kerala. Rich in fibre, vitamins, and natural sweetness.",
                color: "bg-[#F5EDDB]",
              },
              {
                icon: "🌾",
                title: "Wholesome Cereals",
                desc: "Ancient grains, millet, oats, and more — minimally processed to preserve their full nutritional profile.",
                color: "bg-[#E7EEE6]",
              },
              {
                icon: "🤝",
                title: "Farmer Partnerships",
                desc: "Every product supports local farmers through fair trade practices and sustainable agricultural methods.",
                color: "bg-[#FDF0E2]",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`natura-card p-8 !${item.color}`}
              >
                <div
                  className={`${item.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-sm`}
                >
                  {item.icon}
                </div>
                <h3
                  className="text-xl font-bold text-[#2C221E] mb-3"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>
                <p className="text-[#685B55] text-sm leading-[1.8]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}