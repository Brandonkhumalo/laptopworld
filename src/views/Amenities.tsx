/**
 * Amenities Page — Displays "Registered Agent Services" for partner banks and Econet Wireless.
 *
 * Layout structure:
 *   - Navbar (shared site header)
 *   - Hero section with solid primary background (matches system header style)
 *   - Partner logos in animated cards (2-col mobile, 4-col desktop)
 *   - Banking services in a card grid (matches WhyChooseUs card pattern)
 *   - Econet Wireless services in a matching card grid
 *   - Footer (shared site footer)
 *
 * Styling approach:
 *   - Uses motion animations consistent with TrustBar, WhyChooseUs, ProductCard
 *   - Uses font-display, text-gradient, gradient-accent classes from the design system
 *   - Card hover effects match the system's whileHover scale pattern
 *   - Section spacing follows the py-16 / container / px-4 convention
 *
 * Logos are imported as static assets from src/assets/ so Vite can
 * hash and bundle them correctly during production builds.
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Wifi,
  Banknote,
  UserCheck,
  Receipt,
  HandCoins,
  Smartphone,
  CreditCard,
  Radio,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ──────────────────────────────────────────────
 * Asset imports — Vite resolves these to hashed
 * URLs at build time (e.g. /assets/zb-abc123.jpg)
 * ────────────────────────────────────────────── */
const zbLogo = "/images/zb.jpg";
const cbzLogo = "/images/cbz.png";
const nbsLogo = "/images/nbs.png";
const econetLogo = "/images/econet.png";

/* ──────────────────────────────────────────────
 * Partner data — keeps the JSX clean by mapping
 * over an array instead of duplicating markup.
 * ────────────────────────────────────────────── */
const partners = [
  { name: "ZB Bank", logo: zbLogo },
  { name: "CBZ", logo: cbzLogo },
  { name: "NBS Bank", logo: nbsLogo },
  { name: "Econet Wireless", logo: econetLogo },
];

/* ──────────────────────────────────────────────
 * Service definitions — structured data for both
 * the banking and Econet sections so the content
 * is easy to update without touching JSX layout.
 * Each service gets a lucide icon to match the
 * system's icon-driven card pattern.
 * ────────────────────────────────────────────── */
const bankingServices = [
  {
    icon: Banknote,
    title: "Cash Transactions",
    items: [
      "Accept cash deposits into customer accounts",
      "Process cash withdrawals",
      "Facilitate third-party payments",
    ],
  },
  {
    icon: UserCheck,
    title: "Account Services",
    items: [
      "Open certain types of basic bank accounts",
      "Assist with KYC verification (ID and proof of residence checks)",
      "Balance inquiries and mini statements",
    ],
  },
  {
    icon: Receipt,
    title: "Bill Payments & Transfers",
    items: [
      "Process utility bill payments",
      "Handle internal bank transfers",
      "Sometimes facilitate ZIPIT or mobile transfers",
    ],
  },
  {
    icon: HandCoins,
    title: "Loan & Product Support",
    items: [
      "Accept loan repayments",
      "Provide information about bank products",
      "Distribute and collect application forms",
    ],
  },
  {
    icon: Smartphone,
    title: "Mobile & Digital Banking Support",
    items: [
      "Register customers for mobile banking",
      "Help reset PINs",
      "Assist with digital platform onboarding",
    ],
  },
];

const econetServices = [
  {
    icon: CreditCard,
    title: "EcoCash Transactions",
    subtitle: "EcoCash is Econet's mobile money platform",
    items: [
      "Cash-in (deposit money into a customer's EcoCash wallet)",
      "Cash-out (give cash to customers withdrawing from EcoCash)",
      "Facilitate bill payments",
      "Process merchant payments",
    ],
  },
  {
    icon: Radio,
    title: "SIM & Line Services",
    items: [
      "Sell and register new SIM cards",
      "Replace lost or damaged SIM cards",
      "Assist with SIM registration (KYC)",
      "Help customers check numbers or reset PINs",
    ],
  },
  {
    icon: Wifi,
    title: "Airtime & Data Sales",
    items: [
      "Sell airtime vouchers",
      "Sell data bundles",
      "Process airtime purchases directly from the system",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Account & Mobile Support",
    items: [
      "Register customers for EcoCash",
      "Help reset EcoCash PINs",
      "Assist with basic mobile service issues",
    ],
  },
];

/* ──────────────────────────────────────────────
 * ServiceCard — renders a single service as a
 * card with icon, title, and bullet list.
 * Matches the WhyChooseUs / TrustBar card pattern
 * with motion hover and staggered entry animation.
 * ────────────────────────────────────────────── */
function ServiceCard({
  service,
  index,
  accentColor,
}: {
  service: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle?: string;
    items: string[];
  };
  index: number;
  accentColor: string;
}) {
  const Icon = service.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="rounded-xl bg-card border border-border p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      {/* Icon badge — same pattern as WhyChooseUs icon containers */}
      <div className={`inline-flex rounded-lg ${accentColor} p-3 mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>

      {/* Numbered title */}
      <h3 className="font-display font-semibold text-foreground text-lg mb-1">
        <span className="text-muted-foreground mr-1.5">{index + 1}.</span>
        {service.title}
      </h3>

      {/* Optional subtitle */}
      {service.subtitle && (
        <p className="text-xs text-muted-foreground mb-3 italic">
          {service.subtitle}
        </p>
      )}

      {/* Bullet items */}
      <ul className="mt-3 space-y-2.5">
        {service.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
 * Main page component
 * ────────────────────────────────────────────── */
const Amenities = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero section ──────────────────────
       * Uses bg-primary with accent text, matching
       * TrustBar's dark header style rather than a
       * CSS variable gradient (which caused text
       * visibility issues).
       * ────────────────────────────────────── */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground tracking-tight">
              Registered Agent{" "}
              <span className="text-accent">Services</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-primary-foreground/70 max-w-2xl">
              Laptop World is a registered agent providing banking and mobile
              money services for leading Zimbabwean institutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Partner logos section ──────────────
       * Animated card grid following the TrustBar
       * stagger-in animation pattern (delay: i * 0.1).
       * Cards use the system's card/border/shadow tokens.
       * ────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Our <span className="text-gradient">Partners</span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              Trusted institutions we proudly represent
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {partners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-4 p-6 rounded-xl bg-card border border-border shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-default"
              >
                {/* Logo with white background circle for consistent display */}
                <div className="h-20 w-20 rounded-full bg-white border border-border/50 flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    className="h-14 w-14 object-contain"
                  />
                </div>
                <span className="font-display text-sm font-semibold text-foreground text-center">
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banking services section ──────────
       * Card grid layout (1-col mobile, 2-col md, 3-col lg)
       * matching the WhyChooseUs grid pattern.
       * Each service renders as a ServiceCard with
       * staggered entry animation.
       * ────────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-4">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Banking</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Banking <span className="text-gradient">Services</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Registered Agent for ZB Bank, CBZ, NBS Bank and Econet Wireless
              — Services Provided
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {bankingServices.map((service, i) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={i}
                accentColor="bg-primary"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Econet Wireless services section ──
       * Same card grid pattern as banking section
       * but with accent/secondary color scheme to
       * visually distinguish the two sections.
       * ────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 mb-4">
              <Wifi className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Econet</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Econet Wireless <span className="text-gradient">Services</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Mobile money, SIM services, airtime, and digital support
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {econetServices.map((service, i) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={i}
                accentColor="gradient-accent"
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Amenities;
