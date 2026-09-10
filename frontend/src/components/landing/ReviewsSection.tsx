import { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { useReviews } from "../../hooks/useReviews";
import { getImageUrl } from "../../utils/image";

interface ReviewsSectionProps {
  title?: string;
  subtitle?: string;
}

export default function ReviewsSection({
  title = "CUSTOMER REVIEWS",
  subtitle = "REAL EXPERIENCES · REAL NUTRITION",
}: ReviewsSectionProps) {
  const { reviews, isLoading } = useReviews();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) {
    return (
      <section id="reviews" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-14">
          <div className="h-6 w-48 bg-[#E5DCDB]/60 rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-80 bg-[#E5DCDB]/60 rounded-lg mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-white/70 rounded-3xl border border-[#E5DCDB] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  // If no published reviews, hide section gracefully
  if (!reviews || reviews.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      id="reviews"
      className="relative py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#FAF6EE]"
    >
      {/* Subtle organic background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-[#285B3C]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 rounded-full bg-[#E5EEDB]/60 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5EEDB] text-[#285B3C] text-xs font-bold uppercase tracking-widest border border-[#285B3C]/15">
            <span>{subtitle}</span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#285B3C]"
            style={{ fontFamily: "Playfair Display, Cormorant Garamond, serif" }}
          >
            {title}
          </h2>
          <div className="w-16 h-1 bg-[#285B3C]/30 mx-auto rounded-full mt-2" />
          <p className="text-sm sm:text-base text-[#4D7A52] font-medium leading-relaxed pt-2">
            See why health-conscious individuals and families start their day with JACRAL.
          </p>
        </div>

        {/* Carousel / Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {reviews.map((rev, idx) => {
            const customerImg = (rev as any).customer_image_url
              ? getImageUrl((rev as any).customer_image_url)
              : null;

            return (
              <div
                key={rev.id}
                className="bg-white/95 rounded-3xl p-8 border border-[#285B3C]/15 shadow-[0_8px_30px_rgba(40,91,60,0.06)] hover:shadow-[0_12px_40px_rgba(40,91,60,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Ambient Quote watermark */}
                <Quote
                  size={72}
                  className="absolute -top-3 -right-2 text-[#285B3C]/5 pointer-events-none"
                />

                <div>
                  {/* Rating Stars & Quote */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={17}
                          className={
                            i < rev.rating
                              ? "fill-[#E5A832] text-[#E5A832]"
                              : "fill-gray-200 text-gray-200"
                          }
                        />
                      ))}
                    </div>
                    <Quote size={20} className="text-[#285B3C]/30 group-hover:text-[#285B3C] transition-colors" />
                  </div>

                  {/* Review Text */}
                  <p className="text-sm md:text-base text-[#2C221E]/90 leading-relaxed font-medium mb-6 italic">
                    "{rev.review_text}"
                  </p>
                </div>

                {/* Customer Identity */}
                <div className="pt-5 border-t border-[#E5EEDB] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {customerImg ? (
                      <img
                        src={customerImg}
                        alt={rev.customer_name}
                        className="w-10 h-10 rounded-full object-cover border border-[#285B3C]/20"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#E5EEDB] text-[#285B3C] font-bold text-sm flex items-center justify-center border border-[#285B3C]/15">
                        {rev.customer_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold uppercase tracking-tight text-[#285B3C]">
                        {rev.customer_name}
                      </div>
                      {rev.customer_location && (
                        <div className="text-xs text-[#4D7A52] font-medium">
                          {rev.customer_location}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#285B3C] bg-[#E5EEDB]/80 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={12} />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel indicators when more than 3 reviews */}
        {reviews.length > 3 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={handlePrev}
              aria-label="Previous reviews"
              className="p-2.5 rounded-full bg-white border border-[#285B3C]/20 text-[#285B3C] hover:bg-[#285B3C] hover:text-white transition-colors shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1.5">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-6 bg-[#285B3C]"
                      : "w-2 bg-[#285B3C]/20 hover:bg-[#285B3C]/40"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              aria-label="Next reviews"
              className="p-2.5 rounded-full bg-white border border-[#285B3C]/20 text-[#285B3C] hover:bg-[#285B3C] hover:text-white transition-colors shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
