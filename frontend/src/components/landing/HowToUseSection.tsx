import { useState, useEffect } from "react";
import { Sparkles, Utensils, Milk, HeartHandshake } from "lucide-react";
import { getImageUrl } from "../../utils/image";
import type { LandingPageSection } from "../../types/landingPage";

import { apiClient } from "../../api/client";

interface HowToUseStepData {
  id?: number;
  step_number: number;
  title: string;
  description?: string;
  desc?: string;
  image_url?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

interface HowToUseSectionProps {
  section?: LandingPageSection;
}

const DEFAULT_STEPS: HowToUseStepData[] = [
  {
    step_number: 1,
    title: "Pour Cereal",
    description: "Add 40–50g of Jacral Jackfruit Cereal into your breakfast bowl.",
  },
  {
    step_number: 2,
    title: "Add Milk or Plant Milk",
    description: "Pour warm or chilled milk, almond milk, or oat milk over the cereal.",
  },
  {
    step_number: 3,
    title: "Top & Customize",
    description: "Add your favorite fresh berries, nuts, seeds, or a drizzle of raw honey.",
  },
  {
    step_number: 4,
    title: "Savor & Energize",
    description: "Enjoy crisp texture and clean, steady energy that powers your day.",
  },
];

export default function HowToUseSection({ section }: HowToUseSectionProps) {
  const [steps, setSteps] = useState<HowToUseStepData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    apiClient
      .get<HowToUseStepData[]>("/api/v1/content/how-to-use")
      .then((res) => {
        if (!isMounted) return;
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setSteps(data);
        } else if (section?.content?.steps && section.content.steps.length > 0) {
          setSteps(section.content.steps);
        } else {
          setSteps(DEFAULT_STEPS);
        }
        setIsLoading(false);
      })
      .catch(() => {
        if (isMounted) {
          if (section?.content?.steps && section.content.steps.length > 0) {
            setSteps(section.content.steps);
          } else {
            setSteps(DEFAULT_STEPS);
          }
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [section]);

  if (section && section.is_active === false) {
    return null;
  }

  const title = section?.title || "HOW TO USE";
  const subtitle = section?.subtitle || "SIMPLE · WHOLESOME · READY IN MINUTES";

  return (
    <section
      id="how-to-use"
      className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        backgroundColor: "#F7F0DF",
        backgroundImage: "radial-gradient(ellipse at 50% 10%, rgba(229, 238, 219, 0.6) 0%, transparent 70%)",
      }}
    >
      <style>{`
        @keyframes htuReveal {
          from { opacity: 0; transform: translateY(30px) scale(.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes htuIconSpin {
          0%   { transform: rotate(0deg) scale(1); }
          50%  { transform: rotate(14deg) scale(1.12); }
          100% { transform: rotate(0deg) scale(1); }
        }
        @keyframes htuBorderGlow {
          0%, 100% { box-shadow: 0 8px 30px rgba(40,91,60,0.06), 0 0 0 rgba(232,141,54,0); }
          50%      { box-shadow: 0 8px 30px rgba(40,91,60,0.10), 0 0 22px rgba(232,141,54,0.18); }
        }
        @keyframes htuDotTravel {
          0%   { left: 0%; opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes htuNumberPop {
          0%   { transform: scale(0.6); opacity: 0; }
          70%  { transform: scale(1.12); }
          100% { transform: scale(1); opacity: 1; }
        }
        .htu-reveal   { animation: htuReveal .8s cubic-bezier(.22,1,.36,1) both; }
        .htu-card:hover .htu-icon { animation: htuIconSpin 0.7s ease-in-out; }
        .htu-card { animation: htuReveal .8s cubic-bezier(.22,1,.36,1) both, htuBorderGlow 5s ease-in-out infinite; }
        .htu-number { animation: htuNumberPop .6s cubic-bezier(.22,1,.36,1) both; }
        .htu-dot { animation: htuDotTravel 4.5s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .htu-reveal, .htu-card, .htu-number, .htu-dot, .htu-card:hover .htu-icon {
            animation: none !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="htu-reveal text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5EEDB] text-[#285B3C] text-xs font-bold uppercase tracking-widest border border-[#285B3C]/15">
            <Sparkles size={14} className="text-[#285B3C]" />
            <span>{subtitle}</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#285B3C]"
            style={{ fontFamily: "Playfair Display, Cormorant Garamond, serif" }}
          >
            {title}
          </h2>
          <div className="w-16 h-1 bg-[#285B3C]/30 mx-auto rounded-full mt-2" />
        </div>

        {/* Connecting flow line — desktop only, echoes the ribbon above */}
        <div
          className="relative mb-3 hidden lg:block"
          style={{ height: "10px" }}
          aria-hidden="true"
        >
          <div
            className="absolute left-[12%] right-[12%] top-1/2 h-[2px] -translate-y-1/2"
            style={{
              background:
                "repeating-linear-gradient(90deg, #C04422 0, #C04422 8px, transparent 8px, transparent 16px)",
              opacity: 0.35,
            }}
          />
          <span
            className="htu-dot absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle, #E05A35 0%, #C04422 100%)",
              boxShadow: "0 0 8px rgba(192,68,34,0.6)",
            }}
          />
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {steps.slice(0, 4).map((item, idx) => {
            const stepNum = item.step_number || idx + 1;
            const formattedNum = String(stepNum).padStart(2, "0");
            const imgUrl = item.image_url ? getImageUrl(item.image_url) : null;
            const desc = item.description || item.desc || "";

            return (
              <div
                key={item.id || idx}
                className="htu-card bg-white/95 rounded-3xl p-7 border border-[#285B3C]/15 hover:-translate-y-2 hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between group relative overflow-hidden"
                style={{ animationDelay: `${idx * 160}ms, ${idx * 0.4}s` }}
              >
                {/* Step Top Bar */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="htu-number text-3xl sm:text-4xl font-black text-[#285B3C] tracking-tight"
                    style={{
                      fontFamily: "Playfair Display, serif",
                      animationDelay: `${idx * 160 + 200}ms`,
                    }}
                  >
                    {formattedNum}
                  </span>
                  <div className="htu-icon w-9 h-9 rounded-2xl bg-[#E5EEDB] text-[#285B3C] flex items-center justify-center font-bold text-xs transition-transform">
                    {idx === 0 && <Utensils size={16} />}
                    {idx === 1 && <Milk size={16} />}
                    {idx === 2 && <Sparkles size={16} />}
                    {idx === 3 && <HeartHandshake size={16} />}
                  </div>
                </div>

                {/* Step Image */}
                <div className="mb-5 rounded-2xl overflow-hidden h-40 bg-[#FAF6EE] border border-[#E5EEDB] flex items-center justify-center relative">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#285B3C]/40 p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#E5EEDB]/70 flex items-center justify-center mb-2 text-[#285B3C] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                        {idx === 0 && <Utensils size={22} />}
                        {idx === 1 && <Milk size={22} />}
                        {idx === 2 && <Sparkles size={22} />}
                        {idx === 3 && <HeartHandshake size={22} />}
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#4D7A52]">
                        Step {stepNum} Guide
                      </span>
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h3
                    className="text-lg font-bold uppercase tracking-tight text-[#285B3C] mb-2"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#4D7A52] leading-relaxed font-normal">
                    {desc}
                  </p>
                </div>

                {/* Bottom Step Indicator */}
                <div className="mt-6 pt-4 border-t border-[#E5EEDB] flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#285B3C]/70">
                  <span>Step {stepNum} of 4</span>
                  <span className="text-[#285B3C] font-black">Enjoy Fresh</span>
                </div>

                {/* Connector dot to the next card (mobile-hidden, purely decorative) */}
                {idx < 3 && (
                  <span
                    className="hidden lg:flex absolute -right-5 top-1/2 z-20 h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-[#C04422]"
                    style={{ boxShadow: "0 0 0 4px #F7F0DF" }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
