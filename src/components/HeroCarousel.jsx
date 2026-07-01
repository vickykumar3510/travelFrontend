import { useEffect, useState } from "react";

const SLIDES = [
  {
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1400&q=80&auto=format&fit=crop",
    title: "Discover Hidden Gems",
    subtitle: "From serene lakes to vibrant cities across the globe",
  },
  {
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=80&auto=format&fit=crop",
    title: "Plan Your Dream Getaway",
    subtitle: "Personalized itineraries crafted for every kind of traveler",
  },
  {
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1400&q=80&auto=format&fit=crop",
    title: "Explore Asia & Beyond",
    subtitle: "Tokyo, Bali, Dubai — unforgettable destinations await",
  },
  {
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=80&auto=format&fit=crop",
    title: "Adventure Awaits",
    subtitle: "Mountains, beaches, and everything in between",
  },
];

const AUTO_PLAY_MS = 5000;

const HeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, AUTO_PLAY_MS);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => setActiveIndex(index);
  const goToPrevious = () =>
    setActiveIndex((current) => (current - 1 + SLIDES.length) % SLIDES.length);
  const goToNext = () =>
    setActiveIndex((current) => (current + 1) % SLIDES.length);

  return (
    <section className="hero-carousel" aria-label="Featured destinations">
      <div className="hero-carousel-track">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.title}
            className={`hero-carousel-slide${index === activeIndex ? " is-active" : ""}`}
            aria-hidden={index !== activeIndex}
          >
            <img
              src={slide.image}
              alt=""
              className="hero-carousel-image"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="hero-carousel-overlay" />
            <div className="hero-carousel-caption">
              <h2 className="hero-carousel-title">{slide.title}</h2>
              <p className="hero-carousel-subtitle">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="hero-carousel-control hero-carousel-control--prev"
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button
        type="button"
        className="hero-carousel-control hero-carousel-control--next"
        onClick={goToNext}
        aria-label="Next slide"
      >
        ›
      </button>

      <div className="hero-carousel-dots" role="tablist" aria-label="Choose slide">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            role="tab"
            className={`hero-carousel-dot${index === activeIndex ? " is-active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === activeIndex}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
