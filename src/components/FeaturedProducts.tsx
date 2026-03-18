"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { api } from "@/lib/api";

interface ProductData {
  id: number;
  name: string;
  category_name: string;
  price: string;
  deal_price: string | null;
  active_deal: { save_percentage: string } | null;
  image: string | null;
  badge: string;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const visibleCount = 6;

  useEffect(() => {
    api.topPicks.list().then((data: { product: ProductData }[]) => {
      setProducts(data.map((tp: { product: ProductData }) => tp.product));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleNext = useCallback(() => {
    if (products.length <= visibleCount) return;
    setStartIndex((prev) => (prev + 1) % products.length);
  }, [products.length]);

  const handlePrev = useCallback(() => {
    if (products.length <= visibleCount) return;
    setStartIndex((prev) => (prev - 1 + products.length) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (products.length <= visibleCount) return;
    const interval = setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, [products.length, handleNext]);

  const getVisibleProducts = () => {
    if (products.length <= visibleCount) return products;
    const visible = [];
    for (let i = 0; i < visibleCount; i++) {
      visible.push(products[(startIndex + i) % products.length]);
    }
    return visible;
  };

  if (loading) {
    return (
      <section id="products" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">
            This Month's <span className="text-gradient">Top Picks</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-muted h-72" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  const visibleProducts = getVisibleProducts();

  return (
    <section id="products" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex items-center justify-between"
        >
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground" data-testid="text-top-picks-title">
              This Month's <span className="text-gradient">Top Picks</span>
            </h2>
            <div className="mt-2 h-1 w-16 rounded-full gradient-accent" />
          </div>
          {products.length > visibleCount && (
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="rounded-full bg-primary p-2 text-primary-foreground hover:bg-accent transition-colors"
                aria-label="Previous"
                data-testid="button-top-picks-prev"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="rounded-full bg-primary p-2 text-primary-foreground hover:bg-accent transition-colors"
                aria-label="Next"
                data-testid="button-top-picks-next"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {visibleProducts.map((p, i) => (
            <ProductCard
              key={`${p.id}-${startIndex}-${i}`}
              id={p.id}
              image={p.image}
              name={p.name}
              category={p.category_name}
              price={parseFloat(p.price)}
              originalPrice={p.active_deal ? parseFloat(p.price) : undefined}
              dealPrice={p.active_deal && p.active_deal.save_percentage ? parseFloat(String(p.deal_price || p.price)) : undefined}
              badge={p.badge}
              savePercentage={p.active_deal ? parseFloat(p.active_deal.save_percentage) : undefined}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
