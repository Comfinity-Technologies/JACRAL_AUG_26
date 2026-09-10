import { getImageUrl } from "../../utils/image";
import type { HeroSlide as HeroSlideType } from "../../types/landingPage";

interface HeroSlideProps {
  slide: HeroSlideType;
  isActive: boolean;
}

export default function HeroSlide({
  slide,
  isActive,
}: HeroSlideProps) {
  const desktopImg = slide.image_url
    ? getImageUrl(slide.image_url)
    : null;

  const mobileImg = slide.mobile_image_url
    ? getImageUrl(slide.mobile_image_url)
    : desktopImg;

  return (
    <div
      className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${isActive
          ? "opacity-100 z-10 pointer-events-auto"
          : "opacity-0 z-0 pointer-events-none"
        }`}
      aria-hidden={!isActive}
    >
      {desktopImg ? (
        <picture className="block w-full h-full">
          {mobileImg &&
            mobileImg !== desktopImg && (
              <source
                media="(max-width: 767px)"
                srcSet={mobileImg}
              />
            )}

          <img
            src={desktopImg}
            alt={
              slide.title ||
              "JACRAL"
            }
            className="block w-full h-full object-cover object-center"
            loading={
              slide.slide_number === 1
                ? "eager"
                : "lazy"
            }
            draggable={false}
          />
        </picture>
      ) : (
        /*
         * No hardcoded hero design.
         * If the admin has not uploaded an image,
         * simply show a clean empty state.
         */
        <div className="w-full h-full bg-[#FAF6EE] flex items-center justify-center">
          <div className="text-center px-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full border border-[#E88D36]/40 flex items-center justify-center">
              <span className="text-xl font-black text-[#E88D36]">
                J
              </span>
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#685B55]">
              Hero image not published
            </p>
          </div>
        </div>
      )}
    </div>
  );
}