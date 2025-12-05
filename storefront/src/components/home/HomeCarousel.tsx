// src/components/home/HomeCarousel.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";

// SwiperJS
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
  A11y,
  Keyboard,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export type Slide = {
  id: string;
  title: string;
  url: string | null;
  action: string | null;
  image?: { url: string; altText?: string | null } | null;
  imageResponsive?: { url: string; altText?: string | null } | null;
};

export default function HomeCarousel({ slides = [] as Slide[] }) {
  const hasSlides = slides && slides.length > 0;

  const autoplay = useMemo(
    () => ({
      delay: 6000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    }),
    []
  );

  if (!hasSlides) return null;

  return (
    <section className="relative w-full">
      <div className="w-full h-[45vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, A11y, Keyboard]}
          slidesPerView={1}
          spaceBetween={0}
          loop
          autoplay={autoplay}
          keyboard={{ enabled: true }}
          navigation
          pagination={{ clickable: true }}
          a11y={{
            enabled: true,
            containerMessage: "Carrusel de promociones",
            nextSlideMessage: "Siguiente slide",
            prevSlideMessage: "Slide anterior",
          }}
          style={{ width: "100%", height: "100%" }}
        >
          {slides.map((s, idx) => {
            const alt =
              s.image?.altText ||
              s.imageResponsive?.altText ||
              s.title ||
              `Slide ${idx + 1}`;

            const picture = (
              <picture>
                {s.imageResponsive?.url ? (
                  <source
                    media="(max-width: 767px)"
                    srcSet={s.imageResponsive.url}
                  />
                ) : null}
                {s.image?.url ? (
                  <img
                    src={s.image.url}
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                ) : null}
              </picture>
            );

            return (
              <SwiperSlide key={s.id}>
                <div className="relative w-full h-full">
                  {s.url ? (
                    <Link href={s.url} className="group block h-full w-full">
                      {picture}
                      {s.action && (
                        <span className="absolute bottom-6 left-6 inline-flex items-center rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-tz-fg shadow hover:bg-white">
                          {s.action}
                        </span>
                      )}
                    </Link>
                  ) : (
                    picture
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
