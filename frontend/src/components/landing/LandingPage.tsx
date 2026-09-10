import LandingNavbar from "./LandingNavbar";
import HeroSlider from "./HeroSlider";
import ProductsSection from "./ProductsSection";
import RibbonDivider from "./RibbonDivider";
import HowToUseSection from "./HowToUseSection";
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

      {/* ── 3. PRODUCTS SECTION (BENEFITS BAR + 2 FEATURED CARDS + COUPON + CHARACTER & BOARD) ── */}
      <ProductsSection />

      {/* ── 4. 3D RIBBON — CARRIES THE EYE INTO HOW TO ENJOY ── */}
      <RibbonDivider />

      {/* ── 5. HOW TO ENJOY (4 ADMIN-MANAGED STEPS) ── */}
      <HowToUseSection section={howSec} />

      {/* ── 6. CUSTOMER REVIEWS (with red ribbon + hanging animated cards) ── */}
      <ReviewsSection
        title="CUSTOMER REVIEWS"
        subtitle="REAL EXPERIENCES · REAL NUTRITION"
      />

      {/* ── 7. FOOTER (WHEN STANDALONE) ── */}
      {showNavFooter && <Footer />}

    </div>
  );
}
