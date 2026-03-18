"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const heroBanner = "/images/hero-banner.jpg";
const airpods = "/images/hero-banner.jpg";
const iwatch = "/images/hero-banner.jpg";
const galaxyZfold = "/images/hero-banner.jpg";
const macbook = "/images/hero-banner.jpg";
const galaxyZflip = "/images/hero-banner.jpg";
const iphone = "/images/hero-banner.jpg";
const iphone2 = "/images/hero-banner.jpg";
const hpLaptop = "/images/hero-banner.jpg";

const slides = [
  {
    image: heroBanner,
    subtitle: "Zimbabwe's Premier Tech Store",
    title: ["Never Miss Out", "On Life's Greatest", "Moments."],
    desc: "Genuine cellphones, laptops, smartwatches & accessories. Same-day delivery in Harare.",
  },
  {
    image: iphone,
    subtitle: "Latest Smartphones",
    title: ["Flagship Phones", "At Unbeatable", "Prices."],
    desc: "Get the latest iPhones, Samsung Galaxy and more — genuine, sealed, and warranty-backed.",
  },
  {
    image: macbook,
    subtitle: "Power Meets Performance",
    title: ["Premium Laptops", "For Work &", "Play."],
    desc: "MacBook Pro, HP, Lenovo and more. Built for creators, professionals & students.",
  },
  {
    image: airpods,
    subtitle: "Immersive Audio",
    title: ["Sound That", "Moves", "You."],
    desc: "AirPods, Galaxy Buds, and premium headphones for every lifestyle.",
  },
  {
    image: iwatch,
    subtitle: "Stay Connected",
    title: ["Smart Watches", "Built For", "Adventure."],
    desc: "Apple Watch, Galaxy Watch & fitness trackers. Track, connect, and conquer.",
  },
  {
    image: galaxyZflip,
    subtitle: "Innovation Unleashed",
    title: ["Foldable Phones", "The Future Is", "Here."],
    desc: "Experience the latest foldable technology from Samsung and beyond.",
  },
  {
    image: hpLaptop,
    subtitle: "Productivity First",
    title: ["Powerful", "Computing", "Solutions."],
    desc: "From ultrabooks to workstations — find the perfect laptop for your needs.",
  },
  {
    image: galaxyZfold,
    subtitle: "Cutting Edge",
    title: ["Unfold Your", "Potential", "Today."],
    desc: "Multi-tasking reimagined with the latest tri-fold and foldable devices.",
  },
  {
    image: iphone2,
    subtitle: "Colourful Collection",
    title: ["Style Meets", "Substance &", "Innovation."],
    desc: "Choose from the widest range of colors and finishes. Stand out from the crowd.",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(prev => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <section className="relative overflow-hidden min-h-[500px] md:min-h-[600px] lg:min-h-[700px]">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.title.join(' ')}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
        </motion.div>
      </AnimatePresence>

      <div className="relative container mx-auto px-4 py-20 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-accent">
                {slide.subtitle}
              </p>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] mb-6">
                {slide.title[0]}
                <span className="block text-gradient">{slide.title[1]}</span>
                {slide.title[2]}
              </h1>
              <p className="text-lg text-primary-foreground/70 mb-8 max-w-lg">
                {slide.desc}
              </p>
            </motion.div>
          </AnimatePresence>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full gradient-accent px-8 py-3.5 font-semibold text-secondary-foreground hover:opacity-90 transition-opacity animate-pulse-glow"
              data-testid="link-shop-now"
            >
              Shop Now <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#categories"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary-foreground/30 px-8 py-3.5 font-semibold text-primary-foreground hover:border-accent hover:text-accent transition-colors"
              data-testid="link-browse-categories"
            >
              Browse Categories
            </a>
          </div>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 rounded-full p-2 md:p-3 transition-colors z-10"
        data-testid="button-hero-prev"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 rounded-full p-2 md:p-3 transition-colors z-10"
        data-testid="button-hero-next"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
      </button>

      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-accent' : 'w-2 bg-primary-foreground/40 hover:bg-primary-foreground/60'
            }`}
            data-testid={`button-hero-dot-${idx}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
