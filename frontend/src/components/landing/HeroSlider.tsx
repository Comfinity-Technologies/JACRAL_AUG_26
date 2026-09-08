import { useState, useEffect, useRef, useCallback } from "react";
import HeroSlide from "./HeroSlide";
import HeroNavigation from "./HeroNavigation";
import type { HeroSlide as HeroSlideType } from "../../types/landingPage";

interface HeroSliderProps {
  slides?: HeroSlideType[];
}

export default function HeroSlider({ slides = [] }: HeroSliderProps) {
  const activeSlides = slides.filter((s) => s.is_active);
  const total = activeSlides.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay with pause on hover
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(timer);
  }, [total, isPaused, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  if (total === 0) {
    return (
      <section className="relative w-full py-20 bg-[#FAF6EE] text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white border border-[#E5DCDB] shadow-sm">
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#2C221E]">
            JACRAL Whole Food Nutrition
          </h2>
          <p className="text-sm text-[#685B55] mt-2">
            No published hero slides available. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[600px] sm:h-[640px] md:h-[680px] overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="JACRAL Featured Slides"
    >
      {/* Slides Deck */}
      {activeSlides.map((slide, index) => (
        <HeroSlide
          key={slide.id || index}
          slide={slide}
          isActive={index === currentIndex}
        />
      ))}

      {/* Navigation Controls */}
      <HeroNavigation
        total={total}
        current={currentIndex}
        onSelect={(idx) => setCurrentIndex(idx)}
        onPrev={prevSlide}
        onNext={nextSlide}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
      />
    </section>
  );
}
