import { useState, useEffect } from "react";
import { Sparkles, Utensils, Milk, HeartHandshake } from "lucide-react";
import { getImageUrl } from "../../utils/image";
import type { LandingPageSection } from "../../types/landingPage";

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
    fetch("/api/v1/content/how-to-use")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch steps");
        return res.json();
      })
      .then((data: HowToUseStepData[]) => {
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setSteps(data);
          } else if (section?.content?.steps && section.content.steps.length > 0) {
            setSteps(section.content.steps);
          } else {
            setSteps(DEFAULT_STEPS);
          }
          setIsLoading(false);
        }
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
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
                className="bg-white/95 rounded-3xl p-7 border border-[#285B3C]/15 shadow-[0_8px_30px_rgba(40,91,60,0.06)] hover:shadow-[0_12px_40px_rgba(40,91,60,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Step Top Bar */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="text-3xl sm:text-4xl font-black text-[#285B3C] tracking-tight"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {formattedNum}
                  </span>
                  <div className="w-9 h-9 rounded-2xl bg-[#E5EEDB] text-[#285B3C] flex items-center justify-center font-bold text-xs">
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
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-[#285B3C]/40 p-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#E5EEDB]/70 flex items-center justify-center mb-2 text-[#285B3C]">
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
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
