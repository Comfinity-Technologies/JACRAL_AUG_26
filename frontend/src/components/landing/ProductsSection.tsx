import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Leaf, Truck, ShieldCheck, Heart, CheckCheck, ArrowRight } from "lucide-react";
import ProductCard from "../customer/ProductCard";
import { useProducts } from "../../hooks/useProducts";
import { apiClient } from "../../api/client";

interface CouponItem {
  code: string;
  discount_type: string;
  discount_value: number;
  minimum_order_amount?: number;
  description?: string | null;
}

const MASCOT_POSES = [
  {
    src: "/images/mascot/mascot_pose_1.png",
    alt: "Healthy athletic Jacral mascot presenting Jacral Oats products with both hands",
  },
  {
    src: "/images/mascot/mascot_pose_2.png",
    alt: "Healthy athletic Jacral mascot gesturing toward Jacral Oats products with hand on hip",
  },
  {
    src: "/images/mascot/mascot_pose_3.png",
    alt: "Healthy athletic Jacral mascot giving an energetic thumbs up and pointing toward products",
  },
];

export default function ProductsSection() {
  const { products, isLoading } = useProducts();
  const [coupon, setCoupon] = useState<CouponItem | null>(null);
  const [copied, setCopied] = useState(false);

  // Active products filter & selection:
  // Prefer Apple Cinnamon & Dark Chocolate or first 2 active products
  const activeProductsAll = products.filter((p) => p.is_active !== false);

  const applePick = activeProductsAll.find((p) =>
    (p.name + " " + (p.slug || "")).toLowerCase().includes("apple")
  );
  const chocoPick = activeProductsAll.find((p) =>
    (p.name + " " + (p.slug || "")).toLowerCase().includes("chocolate")
  );

  const featuredTwo =
    applePick && chocoPick
      ? [applePick, chocoPick]
      : activeProductsAll.slice(0, 2);

  // Fetch dynamic coupon from backend
  useEffect(() => {
    let isMounted = true;
    apiClient
      .get<CouponItem[]>("/api/v1/content/coupons")
      .then((res) => {
        if (!isMounted) return;
        const list = res.data;
        if (Array.isArray(list) && list.length > 0) {
          // Prefer JACRAL10 or highest/first active percentage coupon
          const found =
            list.find((c) => c.code.toUpperCase() === "JACRAL10") || list[0];
          setCoupon(found);
        }
      })
      .catch(() => {
        // Fallback default dynamic object
        if (isMounted) {
          setCoupon({
            code: "JACRAL10",
            discount_type: "percentage",
            discount_value: 10,
            description: "Get 10% OFF on your first order",
          });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopyCoupon = () => {
    const code = coupon?.code || "JACRAL10";
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    });
  };

  const couponText =
    coupon?.description ||
    `Get ${coupon?.discount_value || 10}% OFF on your first order`;
  const couponCode = coupon?.code || "JACRAL10";

  return (
    <section
      id="products"
      className="relative isolate w-full overflow-hidden"
      style={{
        backgroundColor: "#FAF6ED",
        background:
          "linear-gradient(180deg, #FAF5EA 0%, #F5ECDB 40%, #EFE4CE 75%, #F4ECE0 100%)",
      }}
    >
      {/* =========================================================
          KEYFRAME STYLES & SUBTLE DECORATIVE ANIMATIONS
          ========================================================= */}
      <style>{`
        @keyframes jacralFloatSlow {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50%      { transform: translate3d(0, -9px, 0) rotate(1.2deg); }
        }
        @keyframes jacralFloatMedium {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          50%      { transform: translate3d(4px, -7px, 0) rotate(-1.5deg); }
        }
        @keyframes jacralDrift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -6px, 0); }
        }
        @keyframes jacralPulseSlow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%      { opacity: 0.75; transform: scale(1.08); }
        }
        @keyframes mascotCrossfade {
          0%   { opacity: 0; transform: scale(0.985); }
          12%  { opacity: 1; transform: scale(1); }
          88%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.985); }
        }
        .jacral-float-slow   { animation: jacralFloatSlow 8s ease-in-out infinite; }
        .jacral-float-medium { animation: jacralFloatMedium 6.5s ease-in-out infinite; }
        .jacral-drift        { animation: jacralDrift 7s ease-in-out infinite; }
        .jacral-pulse        { animation: jacralPulseSlow 4.5s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .jacral-float-slow,
          .jacral-float-medium,
          .jacral-drift,
          .jacral-pulse {
            animation: none !important;
          }
        }
      `}</style>

      {/* =========================================================
          SUBTLE AMBIENT BACKGROUND GLOWS & CODED FLOATING ACCENTS
          (NO LARGE JACKFRUIT IMAGE ANYWHERE)
          ========================================================= */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* Warm center ambient light */}
        <div
          className="absolute left-1/2 top-[32%] h-[680px] w-[1150px] -translate-x-1/2 rounded-full opacity-60 blur-[120px]"
          style={{
            background:
              "radial-gradient(ellipse, #FFF5DE 0%, #F5E5BE 45%, transparent 75%)",
          }}
        />

        {/* Coded Floating Oat & Leaf elements scattered behind cards & header */}
        <FloatingOatItem
          top="14%"
          left="7%"
          size={42}
          rotation={-25}
          animationClass="jacral-drift"
        />
        <FloatingLeafItem
          top="11%"
          right="8%"
          size={38}
          rotation={32}
          animationClass="jacral-float-slow"
        />
        <FloatingCerealPiece
          top="18%"
          right="12%"
          size={16}
          rotation={15}
          animationClass="jacral-float-medium"
        />
        <FloatingOatItem
          top="26%"
          left="3%"
          size={36}
          rotation={40}
          animationClass="jacral-float-medium"
        />
        <FloatingLeafItem
          top="33%"
          left="5%"
          size={44}
          rotation={-18}
          animationClass="jacral-float-slow"
        />
        <FloatingCerealPiece
          top="30%"
          right="4%"
          size={18}
          rotation={-22}
          animationClass="jacral-drift"
        />
        <FloatingOatItem
          top="38%"
          right="6%"
          size={32}
          rotation={28}
          animationClass="jacral-float-slow"
        />
        <FloatingLeafItem
          top="46%"
          right="2%"
          size={46}
          rotation={-35}
          animationClass="jacral-float-medium"
        />

        {/* Lower area accents */}
        <FloatingOatItem
          top="66%"
          left="3%"
          size={34}
          rotation={-15}
          animationClass="jacral-drift"
        />
        <FloatingLeafItem
          top="71%"
          left="4%"
          size={40}
          rotation={22}
          animationClass="jacral-float-slow"
        />
        <FloatingCerealPiece
          top="63%"
          right="8%"
          size={15}
          rotation={45}
          animationClass="jacral-float-medium"
        />
        <FloatingOatItem
          top="74%"
          right="5%"
          size={38}
          rotation={-20}
          animationClass="jacral-drift"
        />
        <FloatingLeafItem
          top="82%"
          right="6%"
          size={48}
          rotation={25}
          animationClass="jacral-float-slow"
        />
      </div>

      {/* =========================================================
          1. DARK GREEN BENEFITS BAR (FULL WIDTH)
          ========================================================= */}
      <div
        className="relative z-30 w-full border-b border-[#183B25] bg-[#1F462D] text-[#F4EFE6] shadow-[0_4px_16px_rgba(20,50,30,0.14)]"
      >
        <div className="mx-auto flex w-full max-w-[1440px] flex-col divide-y divide-[#356B48]/40 sm:flex-row sm:divide-x sm:divide-y-0">
          <BenefitItem
            icon={<Truck size={17} strokeWidth={1.8} className="text-[#E5E8C7]" />}
            text="FAST & RELIABLE DELIVERY"
          />
          <BenefitItem
            icon={<Leaf size={17} strokeWidth={1.8} className="text-[#E5E8C7]" />}
            text="100% NATURAL INGREDIENTS"
          />
          <BenefitItem
            icon={<ShieldCheck size={17} strokeWidth={1.8} className="text-[#E5E8C7]" />}
            text="SAFE & SECURE PAYMENTS"
          />
          <BenefitItem
            icon={<Heart size={17} strokeWidth={1.8} className="text-[#E5E8C7]" />}
            text="HEALTHY CHOICES FOR YOU"
          />
        </div>
      </div>

      {/* =========================================================
          MAIN SECTION CONTAINER
          ========================================================= */}
      <div className="relative z-20 mx-auto w-full max-w-[1280px] px-4 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-20">
        
        {/* =======================================================
            2. OUR PRODUCTS HEADING
            ======================================================= */}
        <div className="relative z-20 mb-10 text-center sm:mb-14">
          {/* Decorative leaf emblem: — 🌿 — */}
          <div className="mb-4 flex items-center justify-center gap-4 sm:mb-5 sm:gap-5">
            <span className="h-px w-12 bg-[#28543C]/40 sm:w-16" />
            <Leaf size={18} strokeWidth={1.6} className="text-[#28543C]" />
            <span className="h-px w-12 bg-[#28543C]/40 sm:w-16" />
          </div>

          <h2
            className="text-[#28543C]"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: "clamp(38px, 6vw, 68px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            <span style={{ fontStyle: "italic", fontWeight: 400 }}>OUR </span>
            <span style={{ fontWeight: 900 }}>PRODUCTS</span>
          </h2>
        </div>

        {/* =======================================================
            3. TWO PRODUCT CARDS (SIDE-BY-SIDE ON DESKTOP)
            ======================================================= */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
            <div className="h-[520px] animate-pulse rounded-[28px] border border-[#E6DFC7] bg-[#FAF6ED]/80" />
            <div className="h-[520px] animate-pulse rounded-[28px] border border-[#E6DFC7] bg-[#FAF6ED]/80" />
          </div>
        ) : featuredTwo.length > 0 ? (
          <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-2 lg:gap-10">
            {featuredTwo.map((product) => (
              <div key={product.id} className="h-full">
                <ProductCard product={product} variant="featured" />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-[#E6DFC7] bg-[#FAF6ED] p-12 text-center text-[#5A524A]">
            <p>Products are currently loading from the catalog...</p>
          </div>
        )}

        {/* =======================================================
            5. FITNESS CHARACTER / NATURAL GOODNESS AREA
            (SAME VERTICAL COMPOSITION, CREAM/BEIGE BACKGROUND)
            ======================================================= */}
        <div className="relative mx-auto max-w-[1180px]">
          <div className="grid grid-cols-1 items-end gap-6 lg:grid-cols-12 lg:gap-8">
            
            {/* ---------------------------------------------------
                LOWER LEFT: SINGLE ANIMATED ATHLETE CHARACTER
                Cycles through 3 consistent poses (1 at a time)
                --------------------------------------------------- */}
            <div className="order-1 flex justify-center lg:col-span-5 lg:justify-start">
              <div className="relative w-full max-w-[420px]">
                <MascotPoseCarousel />
              </div>
            </div>

            {/* ---------------------------------------------------
                RIGHT SIDE:
                NATURAL GOODNESS HEADING (TOP)
                + PRODUCTS ON WOODEN SERVING BOARD (BOTTOM)
                --------------------------------------------------- */}
            <div className="order-2 flex flex-col items-center text-center lg:col-span-7 lg:items-end lg:text-right">
              
              {/* Natural Goodness Typography */}
              <div className="mb-6 w-full lg:mb-8">
                <div className="mb-3 flex items-center justify-center gap-3 lg:justify-end">
                  <span className="h-px w-10 bg-[#28543C]/40" />
                  <Leaf size={16} strokeWidth={1.6} className="text-[#28543C]" />
                  <span className="h-px w-10 bg-[#28543C]/40" />
                </div>

                <h3
                  className="text-[#28543C]"
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    fontSize: "clamp(30px, 4.4vw, 54px)",
                    fontWeight: 900,
                    lineHeight: 1.08,
                    letterSpacing: "-0.02em",
                  }}
                >
                  NATURAL GOODNESS
                </h3>

                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#28543C] sm:text-[13px]">
                  HEALTHY YOU &nbsp;•&nbsp; BETTER TOMORROW
                </p>
              </div>

              {/* Wooden Serving Board with JACRAL Products */}
              <div className="relative w-full overflow-hidden rounded-[24px]">
                <img
                  src="/images/products_serving_board_clean.jpg"
                  alt="JACRAL Oats Apple Cinnamon and Dark Chocolate displayed on a rustic wooden board with real apples, cinnamon, and chocolate"
                  className="h-auto w-full object-contain transition-transform duration-700 ease-out hover:scale-[1.02]"
                  style={{
                    filter: "drop-shadow(0 14px 28px rgba(40,30,10,0.12))",
                  }}
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

/* ================================================================
   MASCOT POSE CAROUSEL (3 POSES CYCLING ONE AT A TIME)
   Pose 1: Presenting with both hands
   Pose 2: Changes posture, gestures with one hand
   Pose 3: Energetic healthy/fitness pose (thumbs-up / pointing)
   ================================================================ */

function MascotPoseCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    // 4.2 second interval between pose transitions
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % MASCOT_POSES.length);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative mx-auto w-full max-w-[390px]"
      style={{ aspectRatio: "3/4" }}
    >
      {MASCOT_POSES.map((pose, index) => {
        const isActive = index === activeIdx;
        return (
          <img
            key={pose.src}
            src={pose.src}
            alt={pose.alt}
            className={`absolute inset-0 h-full w-full object-contain transition-all duration-1000 ease-in-out ${
              isActive
                ? "scale-100 opacity-100"
                : "scale-[0.985] opacity-0 pointer-events-none"
            }`}
            style={{
              mixBlendMode: "multiply",
              filter: "drop-shadow(0 8px 24px rgba(30,60,30,0.18))",
            }}
          />
        );
      })}

      {/* Subtle indicator dots */}
      <div className="absolute bottom-2 left-4 z-10 flex items-center gap-1.5 opacity-60 transition-opacity hover:opacity-100">
        {MASCOT_POSES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Switch to pose ${i + 1}`}
            onClick={() => setActiveIdx(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIdx ? "w-5 bg-[#28543C]" : "w-1.5 bg-[#28543C]/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   BENEFIT ITEM (FOR 1. BENEFITS BAR)
   ================================================================ */

function BenefitItem({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center gap-2.5 px-3 py-3 text-center sm:px-4 sm:py-3.5">
      <span className="shrink-0">{icon}</span>
      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#F4EFE6] sm:text-[11px]">
        {text}
      </span>
    </div>
  );
}

/* ================================================================
   CODED FLOATING DECORATIVE PARTICLES (LEAVES, OATS, CEREAL)
   ================================================================ */

function FloatingOatItem({
  top,
  left,
  right,
  size,
  rotation,
  animationClass,
}: {
  top: string;
  left?: string;
  right?: string;
  size: number;
  rotation: number;
  animationClass: string;
}) {
  return (
    <div
      className={`absolute ${animationClass} pointer-events-none opacity-80`}
      style={{
        top,
        left,
        right,
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <img
        src="/images/oat_grains.png"
        alt=""
        className="h-full w-full object-contain"
        style={{ filter: "drop-shadow(0 3px 6px rgba(100,70,20,0.14))" }}
      />
    </div>
  );
}

function FloatingLeafItem({
  top,
  left,
  right,
  size,
  rotation,
  animationClass,
}: {
  top: string;
  left?: string;
  right?: string;
  size: number;
  rotation: number;
  animationClass: string;
}) {
  return (
    <div
      className={`absolute ${animationClass} pointer-events-none opacity-75`}
      style={{
        top,
        left,
        right,
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <img
        src="/images/tropical_leaf.png"
        alt=""
        className="h-full w-full object-contain"
        style={{ filter: "drop-shadow(0 4px 8px rgba(30,80,40,0.15))" }}
      />
    </div>
  );
}

function FloatingCerealPiece({
  top,
  left,
  right,
  size,
  rotation,
  animationClass,
}: {
  top: string;
  left?: string;
  right?: string;
  size: number;
  rotation: number;
  animationClass: string;
}) {
  return (
    <span
      className={`absolute ${animationClass} pointer-events-none rounded-[30%] bg-[#D4A35B]/70`}
      style={{
        top,
        left,
        right,
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg)`,
        boxShadow: "0 2px 5px rgba(120,80,20,0.18)",
      }}
    />
  );
}