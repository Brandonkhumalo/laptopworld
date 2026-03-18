"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import Link from "next/link";

interface Deal {
  id: number;
  product: number;
  product_name: string;
  deal_price: string;
  save_percentage: string;
  active: boolean;
  end_date: string | null;
}

const CountdownBanner = () => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [maxDiscount, setMaxDiscount] = useState(0);
  const [hasDeals, setHasDeals] = useState(false);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    api.deals.list().then((deals: Deal[]) => {
      const active = deals.filter((d: Deal) => d.active);
      if (active.length === 0) return;
      setHasDeals(true);
      const max = Math.max(...active.map((d: Deal) => parseFloat(d.save_percentage)));
      setMaxDiscount(Math.round(max));

      const withEnd = active.find((d: Deal) => d.end_date);
      if (withEnd && withEnd.end_date) {
        setEndDate(new Date(withEnd.end_date));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!endDate) return;
    const interval = setInterval(() => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      if (diff <= 0) {
        setTime({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTime({ hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (!hasDeals) return null;

  return (
    <section className="bg-card py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl gradient-hero p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground" data-testid="text-deal-headline">
              SAVE UP TO <span className="text-gradient">{maxDiscount}%</span>
            </h2>
            {endDate ? (
              <>
                <p className="mt-2 text-sm uppercase tracking-widest text-primary-foreground/60">
                  Offer ends in:
                </p>
                <div className="mt-4 flex gap-3 justify-center md:justify-start">
                  {[
                    { val: pad(time.hours), label: "HRS" },
                    { val: pad(time.minutes), label: "MIN" },
                    { val: pad(time.seconds), label: "SEC" },
                  ].map((u) => (
                    <div key={u.label} className="flex flex-col items-center rounded-lg border border-accent/30 bg-primary-foreground/5 px-4 py-2 min-w-[60px]">
                      <span className="font-display text-2xl font-bold text-primary-foreground" data-testid={`text-countdown-${u.label.toLowerCase()}`}>{u.val}</span>
                      <span className="text-[10px] uppercase tracking-wider text-primary-foreground/50">{u.label}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm uppercase tracking-widest text-primary-foreground/60">
                Limited time offer
              </p>
            )}
          </div>
          <Link
            href="/deals"
            className="rounded-full gradient-accent px-8 py-3.5 font-semibold text-secondary-foreground hover:opacity-90 transition-opacity"
            data-testid="link-shop-deals"
          >
            Shop Deals →
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CountdownBanner;
