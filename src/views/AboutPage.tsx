"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Target,
  ShieldCheck,
  Users,
  Award,
  Lightbulb,
  ClipboardCheck,
  Scale,
  Laptop,
  Globe,
  Wrench,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const coreValues = [
  { icon: ShieldCheck, title: "Integrity & Transparency", desc: "We operate with honesty and openness in every interaction." },
  { icon: Users, title: "Customer-Centered Service", desc: "Your needs come first in everything we do." },
  { icon: Award, title: "Professional Excellence", desc: "We strive for the highest standards in our products and services." },
  { icon: Lightbulb, title: "Innovation & Adaptability", desc: "We embrace change and continuously seek better solutions." },
  { icon: ClipboardCheck, title: "Accountability", desc: "We take ownership of our commitments and deliver on our promises." },
  { icon: Scale, title: "Regulatory Compliance", desc: "We adhere to all industry regulations and best practices." },
];

const visionHighlights = [
  { icon: Laptop, title: "Affordability & Accessibility", desc: "Locally branded laptops tailored to the purchasing power of local consumers and institutions, making technology more accessible." },
  { icon: Globe, title: "Customization for Local Needs", desc: "Devices designed with specifications suitable for local education systems, businesses, and climate conditions." },
  { icon: Wrench, title: "Technological Independence", desc: "Contributing to Zimbabwe's technological independence and innovation ecosystem." },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-primary py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="relative container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            About <span className="text-accent">Laptop World</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-primary-foreground/70 max-w-2xl mx-auto text-lg"
          >
            Zimbabwe's trusted technology partner — delivering affordable, reliable, and innovative electronic products.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg bg-accent/10 p-3">
                <Target className="h-7 w-7 text-accent" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Our <span className="text-gradient">Mission</span>
              </h2>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <p className="text-lg text-muted-foreground leading-relaxed">
                To provide affordable, reliable, and innovative electronic products and convenient service solutions
                while maintaining excellence in customer care, operational integrity, and regulatory compliance.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg bg-accent/10 p-3">
                <Eye className="h-7 w-7 text-accent" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Our <span className="text-gradient">Vision</span>
              </h2>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                To become Zimbabwe's most trusted provider of technology solutions, electronic appliances,
                and integrated financial services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                A key part of our long-term vision is to develop and launch a locally branded line of laptops
                under the <span className="font-semibold text-foreground">LAPTOP WORLD</span> brand, designed
                to meet the needs of African markets in terms of affordability, durability, and performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visionHighlights.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="rounded-lg bg-accent/10 p-3 w-fit mb-4">
                    <item.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Our Core <span className="text-gradient">Values</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              The principles that guide everything we do at Laptop World.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {coreValues.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.03 }}
                className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="rounded-lg bg-accent/10 p-3 w-fit mb-4">
                  <value.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Through this vision, LAPTOP WORLD aims to contribute to Zimbabwe's
              technological independence and innovation ecosystem.
            </h2>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
