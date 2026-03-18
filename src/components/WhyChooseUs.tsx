"use client";

import { motion } from "framer-motion";
import { Zap, Globe, Heart, Users, Sparkles, Clock } from "lucide-react";

const airpods = "/images/hero-banner.jpg";
const smartwatch = "/images/product-watch.jpg";
const galaxyXr = "/images/product-phone.jpg";
const macbook = "/images/product-laptop.jpg";
const applevision = "/images/hero-banner.jpg";
const hpLaptop = "/images/product-laptop.jpg";

const values = [
  { icon: Zap, title: "Competitive", desc: "Best prices in Zimbabwe for genuine tech products", bg: macbook },
  { icon: Globe, title: "World-Class", desc: "International quality standards and top-tier brands", bg: airpods },
  { icon: Heart, title: "Passionate", desc: "Driven by our love for technology and customer satisfaction", bg: smartwatch },
  { icon: Users, title: "Customer-Centric", desc: "Your needs come first in everything we do", bg: galaxyXr },
  { icon: Sparkles, title: "Preferred Partner", desc: "Trusted by individuals and businesses nationwide", bg: applevision },
  { icon: Clock, title: "Flexible & Quick", desc: "Fast turnaround and adaptable to your needs", bg: hpLaptop },
];

const WhyChooseUs = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Why Clients <span className="text-gradient">Love Us</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Laptop World is Zimbabwe's trusted technology partner for laptops, phones, accessories and all gadgets.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="relative rounded-xl overflow-hidden min-h-[220px] group"
          >
            <img
              src={v.bg}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
            <div className="relative p-6 flex flex-col justify-end h-full">
              <div className="mb-3 inline-flex rounded-lg bg-accent/20 backdrop-blur-sm p-3 w-fit">
                <v.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-primary-foreground mb-1.5">We Are {v.title}</h3>
              <p className="text-sm text-primary-foreground/70">{v.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
