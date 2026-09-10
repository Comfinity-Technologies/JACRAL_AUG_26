import type { Product } from "../../types/product";
import { ArrowRight, Leaf, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { getImageUrl } from "../../utils/image";
import { useCart } from "../../hooks/useCart";

export type ProductCardItem = Product | {
  id: number;
  name: string;
  description?: string;
  price: number | string;
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
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addToCart } = useCart();
  const [hovered, setHovered] = useState(false);

  const primaryImage = product.image_url
    ? getImageUrl(product.image_url)
    : null;

  const hoverImage = product.hover_image_url
    ? getImageUrl(product.hover_image_url)
    : null;

  const isOutOfStock = Number(product.stock) <= 0;
  const productUrl = `/product/${product.id}`;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    if (onAddToCart) {
      await onAddToCart();
    } else {
      await addToCart(product.id, 1);
    }
  };

  return (
    <>
      {/* ============================================================
          PER-CARD KEYFRAMES
          ============================================================ */}
      <style>{`
        @keyframes imgLevitate {
          0%, 100% {
            transform: perspective(700px) rotateX(4deg) rotateY(-6deg) translateY(0px) scale(1.04);
            filter: drop-shadow(0 18px 28px rgba(80,40,10,0.30)) drop-shadow(0 6px 10px rgba(80,40,10,0.16));
          }
          50% {
            transform: perspective(700px) rotateX(2deg) rotateY(4deg) translateY(-10px) scale(1.07);
            filter: drop-shadow(0 28px 36px rgba(80,40,10,0.38)) drop-shadow(0 8px 14px rgba(80,40,10,0.22));
          }
        }
        @keyframes shimmer3D {
          0%   { opacity: 0.0; transform: translateX(-120%) skewX(-15deg); }
          50%  { opacity: 0.35; }
          100% { opacity: 0.0; transform: translateX(220%) skewX(-15deg); }
        }
        @keyframes badgePop {
          0%   { transform: scale(0.75); opacity: 0; }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes dotBlink {
          0%, 100% { opacity: 0.6; transform: scale(1);   }
          50%       { opacity: 1;   transform: scale(1.5); }
        }
        @keyframes groundShadowPulse {
          0%, 100% { transform: translateX(-50%) scaleX(1);   opacity: 0.20; }
          50%       { transform: translateX(-50%) scaleX(0.85); opacity: 0.30; }
        }

        .pc-img-levitate        { animation: imgLevitate         5.2s ease-in-out infinite; }
        .pc-shimmer             { animation: shimmer3D            3.0s ease-in-out infinite 1.5s; }
        .pc-badge-pop           { animation: badgePop             0.5s cubic-bezier(.22,1,.36,1) both; }
        .pc-dot-blink           { animation: dotBlink             2.1s ease-in-out infinite; }
        .pc-ground-shadow-pulse { animation: groundShadowPulse    5.2s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .pc-img-levitate, .pc-shimmer, .pc-badge-pop,
          .pc-dot-blink, .pc-ground-shadow-pulse {
            animation: none !important;
          }
        }
      `}</style>

      <article
        className="group relative flex h-full flex-col overflow-hidden"
        style={{
          borderRadius: "30px",
          border: "1.5px solid rgba(196,156,110,0.35)",
          background:
            "linear-gradient(160deg, #FFFDF8 0%, #FBF4E6 60%, #F5EDD7 100%)",
          boxShadow:
            "0 8px 32px rgba(110,55,15,.09), 0 2px 8px rgba(110,55,15,.06), inset 0 1px 0 rgba(255,255,255,0.9)",
          transition:
            "transform 0.45s cubic-bezier(.22,1,.36,1), box-shadow 0.45s cubic-bezier(.22,1,.36,1)",
          willChange: "transform",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={(e) => {
          setHovered(false);
          e.currentTarget.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateY(0px)";
          e.currentTarget.style.boxShadow =
            "0 8px 32px rgba(110,55,15,.09), 0 2px 8px rgba(110,55,15,.06), inset 0 1px 0 rgba(255,255,255,0.9)";
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
          e.currentTarget.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg) translateY(-5px)`;
          e.currentTarget.style.boxShadow = `${-x * 1.2}px ${22 + Math.abs(y * 1.5)}px 55px rgba(110,55,15,0.2), 0 4px 14px rgba(110,55,15,0.09), inset 0 1px 0 rgba(255,255,255,0.9)`;
        }}
      >
        {/* ============================================================
            TOP IMAGE ZONE
            ============================================================ */}
        <Link
          to={productUrl}
          className="relative block"
          style={{ padding: "20px 20px 0" }}
        >
          {/* Rounded image container with warm 3D depth */}
          <div
            style={{
              position: "relative",
              aspectRatio: "1.15 / 1",
              borderRadius: "22px",
              overflow: "hidden",
              background:
                "radial-gradient(ellipse at 38% 28%, #EFE3CA 0%, #E3D4B4 55%, #D5C49A 100%)",
              boxShadow:
                "inset 0 3px 18px rgba(90,50,10,.08), inset 0 -2px 10px rgba(90,50,10,.05)",
            }}
          >
            {/* Warm amber glow — top right */}
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "210px",
                height: "210px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(210,142,60,0.35) 0%, transparent 68%)",
                pointerEvents: "none",
                transition: "transform 0.7s ease",
                transform: hovered ? "scale(1.35)" : "scale(1)",
              }}
            />
            {/* Green glow — bottom left */}
            <div
              style={{
                position: "absolute",
                bottom: "-40px",
                left: "-40px",
                width: "170px",
                height: "170px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(49,94,66,0.28) 0%, transparent 68%)",
                pointerEvents: "none",
              }}
            />
            {/* Red accent glow — top center-right */}
            <div
              style={{
                position: "absolute",
                top: "15%",
                right: "12%",
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(192,68,34,0.18) 0%, transparent 68%)",
                pointerEvents: "none",
              }}
            />

            {/* ── PRODUCT IMAGE FROM ADMIN PANEL (3D levitating) ── */}
            {primaryImage ? (
              <>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={hovered && hoverImage ? hoverImage : primaryImage}
                    alt={product.name}
                    className="pc-img-levitate"
                    style={{
                      width: "78%",
                      height: "88%",
                      objectFit: "contain",
                      transition: "opacity 0.45s ease",
                    }}
                  />
                </div>

                {/* Ground shadow (synced with levitate) */}
                <div
                  className="pc-ground-shadow-pulse"
                  style={{
                    position: "absolute",
                    bottom: "9px",
                    left: "50%",
                    width: "54%",
                    height: "16px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(ellipse, rgba(80,40,10,0.22) 0%, transparent 72%)",
                    pointerEvents: "none",
                    filter: "blur(5px)",
                  }}
                />

                {/* Shimmer reflection */}
                <div
                  className="pc-shimmer"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "38%",
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.52) 50%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />
              </>
            ) : (
              /* Fallback — no image */
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="pc-img-levitate"
                  style={{
                    width: "96px",
                    height: "96px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #315E42, #1E3D28)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 14px 32px rgba(49,94,66,0.32)",
                    color: "white",
                  }}
                >
                  <Leaf size={40} strokeWidth={1.2} />
                </div>
              </div>
            )}

            {/* ── JACRAL OATS BADGE (top-left) ── */}
            <div
              className="pc-badge-pop"
              style={{
                position: "absolute",
                top: "13px",
                left: "13px",
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 13px",
                borderRadius: "999px",
                background: "rgba(247,240,226,0.94)",
                border: "1px solid rgba(49,94,66,0.18)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 14px rgba(49,94,66,0.14)",
              }}
            >
              <Leaf
                size={11}
                strokeWidth={1.6}
                style={{ color: "#315E42", flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: "8px",
                  fontWeight: 900,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#315E42",
                }}
              >
                {product.badge || "JACRAL OATS"}
              </span>
            </div>

            {/* ── RED ACCENT DOT (top-right corner) ── */}
            <div
              className="pc-dot-blink"
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, #E05A35 0%, #C04422 100%)",
                boxShadow: "0 0 7px rgba(192,68,34,0.55)",
              }}
            />
            {/* ── SMALL GREEN DOT (bottom-right) ── */}
            <div
              style={{
                position: "absolute",
                bottom: "14px",
                right: "18px",
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "#315E42",
                opacity: 0.55,
              }}
            />
          </div>
        </Link>

        {/* ============================================================
            PRODUCT CONTENT
            ============================================================ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "22px 24px 24px",
          }}
        >
          {/* JACRAL OATS label — red line + text */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                width: "22px",
                height: "2px",
                background: "linear-gradient(90deg, #C04422, #E05A35)",
                borderRadius: "2px",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "8px",
                fontWeight: 900,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#C04422",
              }}
            >
              JACRAL OATS
            </span>
          </div>

          {/* Product name — large, bold, uppercase */}
          <Link to={productUrl} style={{ textDecoration: "none" }}>
            <h3
              style={{
                fontSize: "clamp(21px, 2.4vw, 27px)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "-0.04em",
                lineHeight: 1.1,
                color: "#28221D",
                marginBottom: "10px",
                transition: "color 0.3s ease",
              }}
              className="group-hover:!text-[#315E42]"
            >
              {product.name}
            </h3>
          </Link>

          {/* Description */}
          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.65,
              color: "#74695F",
              minHeight: "44px",
              flex: 1,
            }}
          >
            {product.description}
          </p>

          {/* ── GRADIENT DIVIDER ── */}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, #D5C4A8 30%, #C4B090 60%, transparent)",
              margin: "18px 0 16px",
            }}
          />

          {/* ── ACTION BUTTONS ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            {/* DETAILS */}
            <Link
              to={productUrl}
              className="group/details flex items-center justify-center gap-1.5"
              style={{
                minHeight: "48px",
                borderRadius: "999px",
                border: "1.5px solid #302923",
                background: "transparent",
                fontSize: "9px",
                fontWeight: 900,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#302923",
                transition: "all 0.3s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "#302923";
                el.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "transparent";
                el.style.color = "#302923";
              }}
            >
              DETAILS
              <ArrowRight
                size={13}
                style={{ transition: "transform 0.3s ease" }}
                className="group-hover/details:translate-x-0.5"
              />
            </Link>

            {/* SHOP NOW */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                minHeight: "48px",
                borderRadius: "999px",
                background: isOutOfStock
                  ? "#D1C7BA"
                  : "linear-gradient(135deg, #285B3C 0%, #1E482E 100%)",
                fontSize: "9px",
                fontWeight: 900,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#fff",
                boxShadow: isOutOfStock
                  ? "none"
                  : "0 8px 22px rgba(40,91,60,0.28), 0 2px 6px rgba(40,91,60,0.16)",
                transition: "all 0.3s ease",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                border: "none",
              }}
              onMouseEnter={(e) => {
                if (isOutOfStock) return;
                const el = e.currentTarget;
                el.style.background =
                  "linear-gradient(135deg, #3D7050 0%, #2A5639 100%)";
                el.style.boxShadow =
                  "0 13px 30px rgba(40,91,60,0.38), 0 4px 10px rgba(40,91,60,0.22)";
                el.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                if (isOutOfStock) return;
                const el = e.currentTarget;
                el.style.background =
                  "linear-gradient(135deg, #285B3C 0%, #1E482E 100%)";
                el.style.boxShadow =
                  "0 8px 22px rgba(40,91,60,0.28), 0 2px 6px rgba(40,91,60,0.16)";
                el.style.transform = "none";
              }}
            >
              <ShoppingBag size={13} strokeWidth={1.8} />
              {isOutOfStock ? "OUT OF STOCK" : "SHOP NOW"}
            </button>
          </div>

          {/* Out of stock notice */}
          {isOutOfStock && (
            <p
              style={{
                marginTop: "10px",
                textAlign: "center",
                fontSize: "8.5px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#A15E4B",
              }}
            >
              Currently unavailable
            </p>
          )}
        </div>

        {/* ── BOTTOM EDGE TRICOLOR BAR ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "12%",
            right: "12%",
            height: "3px",
            background:
              "linear-gradient(90deg, #8B4513 0%, #315E42 33%, #C04422 66%, #315E42 84%, #8B4513 100%)",
            borderRadius: "0 0 4px 4px",
            opacity: 0.5,
          }}
        />
      </article>
    </>
  );
}