import { Star, Leaf, CheckCircle2, Quote } from "lucide-react";
import { useReviews } from "../../hooks/useReviews";

interface ReviewsSectionProps {
  title?: string;
  subtitle?: string;
}

// Alternating pastel color palette for review cards
const CARD_THEMES = [
  {
    bg: "#E3F0DC", // Light Green
    border: "#28543C",
    accent: "#3B6E4C",
    tagBg: "#D0E7C5",
    tagText: "#1F462D",
    pin: "#78A942",
  },
  {
    bg: "#FDE8D7", // Light Orange
    border: "#9E3C1A",
    accent: "#C04422",
    tagBg: "#FBD6BA",
    tagText: "#8A2A0F",
    pin: "#E88D36",
  },
  {
    bg: "#FEF3D6", // Light Yellow
    border: "#8C6A18",
    accent: "#D4A325",
    tagBg: "#FDE8AC",
    tagText: "#735308",
    pin: "#E5B834",
  },
];

export default function ReviewsSection({
  title = "CUSTOMER REVIEWS",
  subtitle = "REAL EXPERIENCES · REAL NUTRITION",
}: ReviewsSectionProps) {
  const { reviews, isLoading } = useReviews();

  // Fallback reviews if API has not loaded yet
  const displayReviews =
    reviews && reviews.length > 0
      ? reviews
      : [
          {
            id: 1,
            customer_name: "Dr. Priya Sharma",
            customer_location: "Bengaluru, Karnataka",
            rating: 5,
            review_text:
              "As a nutritionist, I am thoroughly impressed by Jacral. 20% natural protein and zero sugar in a breakfast cereal made from unripe jackfruit is a game changer for metabolic health.",
          },
          {
            id: 2,
            customer_name: "Vikram Menon",
            customer_location: "Kochi, Kerala",
            rating: 5,
            review_text:
              "The taste is wonderful! It's nutty, wholesome, and keeps me genuinely full until lunch. Knowing it's made from jackfruit bulbs and seeds makes it even better.",
          },
          {
            id: 3,
            customer_name: "Ananya Roy",
            customer_location: "Mumbai, Maharashtra",
            rating: 5,
            review_text:
              "Finally a cereal without hidden sugars or artificial fluff. Love pairing it with cold almond milk and chia seeds in the morning.",
          },
          {
            id: 4,
            customer_name: "Rahul Verma",
            customer_location: "Delhi NCR",
            rating: 5,
            review_text:
              "Clean ingredients, delicious crunch, and amazing sustained energy throughout my morning workouts. 10/10 recommended!",
          },
        ];

  // Quadruple the list so the marquee loops seamlessly without gaps
  const marqueeItems = [...displayReviews, ...displayReviews, ...displayReviews];

  return (
    <section
      id="reviews"
      className="relative overflow-hidden bg-[#100E0D] text-white pt-0 pb-28 md:pb-36"
    >
      {/* =========================================================
          KEYFRAME ANIMATIONS
          ========================================================= */}
      <style>{`
        @keyframes ribbonFlowDash {
          0%   { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -240; }
        }
        @keyframes ribbonGentleBob {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes reviewMarqueeTrack {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes cardGentleSway {
          0%, 100% { transform: rotate(-0.5deg); }
          50%      { transform: rotate(0.8deg); }
        }
        .ribbon-bob-anim   { animation: ribbonGentleBob 6s ease-in-out infinite; }
        .ribbon-flow-dash  { animation: ribbonFlowDash 3.5s linear infinite; }
        .review-marquee    { animation: reviewMarqueeTrack 34s linear infinite; }
        .review-marquee-wrap:hover .review-marquee {
          animation-play-state: paused;
        }

        /* SVG Zigzag Border styling */
        .zigzag-card-border {
          filter: drop-shadow(0 12px 24px rgba(0, 0, 0, 0.45));
        }

        @media (prefers-reduced-motion: reduce) {
          .ribbon-bob-anim,
          .ribbon-flow-dash,
          .review-marquee {
            animation: none !important;
          }
        }
      `}</style>

      {/* =========================================================
          1. 3D FLOWING RED RIBBON (TOP OF SECTION)
          Carries the eye from How To Enjoy into Customer Reviews
          ========================================================= */}
      <div className="relative w-full overflow-hidden" style={{ height: "135px" }}>
        <svg
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          className="ribbon-bob-anim absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="revRibbonRed" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7A2214" />
              <stop offset="25%" stopColor="#A93322" />
              <stop offset="50%" stopColor="#D84B2B" />
              <stop offset="75%" stopColor="#A93322" />
              <stop offset="100%" stopColor="#7A2214" />
            </linearGradient>
            <linearGradient id="revRibbonShadow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#45120A" />
              <stop offset="50%" stopColor="#6E1C0F" />
              <stop offset="100%" stopColor="#45120A" />
            </linearGradient>
          </defs>

          {/* Ribbon 3D Shadow Underside */}
          <path
            d="M0,60 C240,130 420,10 720,55 C1020,100 1200,10 1440,50 L1440,90 C1200,45 1020,135 720,90 C420,45 240,165 0,95 Z"
            fill="url(#revRibbonShadow)"
            opacity="0.9"
          />

          {/* Ribbon Front Face */}
          <path
            d="M0,45 C240,115 420,-5 720,40 C1020,85 1200,-5 1440,35 L1440,75 C1200,30 1020,120 720,75 C420,30 240,150 0,80 Z"
            fill="url(#revRibbonRed)"
          />

          {/* Flowing stitched highlight line */}
          <path
            d="M0,52 C240,122 420,2 720,47 C1020,92 1200,2 1440,42"
            fill="none"
            stroke="rgba(255,255,255,0.65)"
            strokeWidth="2.2"
            strokeDasharray="10 12"
            className="ribbon-flow-dash"
          />
        </svg>
      </div>

      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-40"
        aria-hidden="true"
      >
        <div
          className="absolute left-1/2 top-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full blur-[140px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(169,51,34,0.3) 0%, rgba(40,91,60,0.15) 50%, transparent 80%)",
          }}
        />
      </div>

      {/* =========================================================
          SECTION HEADER
          ========================================================= */}
      <div className="relative z-20 mx-auto max-w-4xl px-4 text-center mt-4 mb-14 sm:mb-16">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-[#F4EEDB]">
          <Leaf size={13} className="text-[#84B440]" />
          <span>{subtitle}</span>
        </div>

        <h2
          className="text-white"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "clamp(34px, 5vw, 56px)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-[#D4C9BC] font-medium leading-relaxed">
          Real feedback from health-conscious individuals who fuel their mornings with JACRAL Oats.
        </p>
      </div>

      {/* =========================================================
          HANGING ANIMATED REVIEW CARDS (MARQUEE)
          Cards hang from strings under the red ribbon area
          Alternating Light Green, Light Orange, Light Yellow
          With Zigzag Borders on a Black Background
          ========================================================= */}
      <div className="review-marquee-wrap relative w-full overflow-hidden select-none">
        
        {/* Soft edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-30 w-16 bg-gradient-to-r from-[#100E0D] to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-30 w-16 bg-gradient-to-l from-[#100E0D] to-transparent sm:w-32" />

        <div className="review-marquee flex w-max items-start gap-8 sm:gap-10 py-6">
          {marqueeItems.map((rev, idx) => {
            const theme = CARD_THEMES[idx % CARD_THEMES.length];

            return (
              <div
                key={`rev-item-${idx}`}
                className="group relative flex flex-col items-center"
                style={{ width: "350px" }}
              >
                {/* -------------------------------------------------
                    HANGING ROPE / STRING FROM RED RIBBON
                    ------------------------------------------------- */}
                <div className="relative flex flex-col items-center">
                  {/* Vertical hanging line */}
                  <div
                    className="w-[2px] h-12"
                    style={{
                      background:
                        "linear-gradient(to bottom, #A93322 0%, #D4A35B 60%, #8C5E39 100%)",
                      boxShadow: "0 0 4px rgba(212,163,91,0.5)",
                    }}
                  />

                  {/* Wooden Clothespin / Metal Clip */}
                  <div
                    className="relative -mb-3 z-20 flex h-6 w-5 items-center justify-center rounded-sm shadow-md"
                    style={{
                      backgroundColor: theme.pin,
                      border: "1px solid rgba(0,0,0,0.35)",
                    }}
                  >
                    <div className="h-3 w-[1.5px] bg-[#2C221E]/60 rounded-full" />
                  </div>
                </div>

                {/* -------------------------------------------------
                    REVIEW CARD WITH ZIGZAG BORDER
                    (Light green, orange, yellow card surface)
                    ------------------------------------------------- */}
                <div
                  className="zigzag-card-border relative w-full transition-transform duration-300 group-hover:-translate-y-1.5"
                  style={{
                    backgroundColor: theme.bg,
                    color: "#2C221E",
                    borderRadius: "16px",
                    // SVG Zigzag border pattern along card edges
                    border: `3px solid ${theme.border}`,
                    boxShadow: "0 16px 36px rgba(0,0,0,0.55)",
                  }}
                >
                  {/* Decorative Zigzag Top & Bottom Pattern */}
                  <div
                    className="absolute -top-[7px] left-0 right-0 h-[7px] pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 7px 7px, transparent 6px, ${theme.border} 7px)`,
                      backgroundSize: "14px 7px",
                    }}
                  />

                  <div
                    className="absolute -bottom-[7px] left-0 right-0 h-[7px] pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(circle at 7px 0px, transparent 6px, ${theme.border} 7px)`,
                      backgroundSize: "14px 7px",
                    }}
                  />

                  {/* Card Content Container */}
                  <div className="p-6 sm:p-7 flex flex-col justify-between min-h-[260px]">
                    
                    {/* Top Row: Stars & Verified Badge */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        {/* 5 Stars */}
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={
                                star <= (rev.rating || 5)
                                  ? "fill-amber-400 text-amber-500"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>

                        {/* Verified Tag */}
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shadow-sm"
                          style={{
                            backgroundColor: theme.tagBg,
                            color: theme.tagText,
                          }}
                        >
                          <CheckCircle2 size={11} strokeWidth={2.5} />
                          Verified
                        </span>
                      </div>

                      {/* Review Quote Text */}
                      <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#2C221E] font-medium line-clamp-5 italic">
                        "{rev.review_text}"
                      </p>
                    </div>

                    {/* Bottom Row: Customer Name & Location */}
                    <div className="mt-5 pt-3 border-t border-black/10 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-[#1A1816] tracking-tight">
                          {rev.customer_name}
                        </p>
                        {rev.customer_location && (
                          <p className="text-xs font-semibold text-[#5F544C]">
                            {rev.customer_location}
                          </p>
                        )}
                      </div>

                      {/* Small quote icon */}
                      <Quote
                        size={20}
                        className="opacity-35 shrink-0"
                        style={{ color: theme.border }}
                      />
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
