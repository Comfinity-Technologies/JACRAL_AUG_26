import LandingNavbar from "./LandingNavbar";
import HeroSlider from "./HeroSlider";
import ProductsSection from "./ProductsSection";
import HowToUseSection from "./HowToUseSection";
import CouponPromoSection from "./CouponPromoSection";
import ReviewsSection from "./ReviewsSection";
import Footer from "../customer/Footer";
import { useLandingPage } from "../../hooks/useLandingPage";

interface LandingPageProps {
  showNavFooter?: boolean;
}

export default function LandingPage({ showNavFooter = false }: LandingPageProps) {
  const { data } = useLandingPage();

  const brand = data?.brand;
  const slides = data?.hero_slides || [];
  const sections = data?.sections || {};

  const howSec = sections["how_to_use"];

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#2C221E] font-sans antialiased selection:bg-[#E88D36] selection:text-white">

      {/* ── 1. HEADER / NAVIGATION (WHEN STANDALONE) ── */}
      {showNavFooter && <LandingNavbar brand={brand} />}

      {/* ── 2. HERO SLIDER ── */}
      <HeroSlider slides={slides} />

      {/* ── 3. PRODUCTS SECTION (GREEN STRIP + 2 EQUAL FEATURED CARDS) ── */}
      <ProductsSection section={sections["products_section"]} />

      {/* ── 4. HOW TO USE (4 ADMIN-MANAGED STEPS) ── */}
      <HowToUseSection section={howSec} />

      {/* ── 5. COUPON PROMO STRIP ── */}
      <CouponPromoSection />

      {/* ── 6. CUSTOMER REVIEWS (TESTIMONIAL CAROUSEL / CARDS) ── */}
      <ReviewsSection
        title="CUSTOMER REVIEWS"
        subtitle="REAL EXPERIENCES · REAL NUTRITION"
      />

      {/* ── 7. FOOTER (WHEN STANDALONE) ── */}
      {showNavFooter && <Footer />}

    </div>
  );
}

