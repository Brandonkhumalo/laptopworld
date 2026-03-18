"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, CreditCard, Award } from "lucide-react";

const trusts = [
  { icon: ShieldCheck, label: "Genuine Products", desc: "100% Authentic" },
  { icon: Award, label: "12 Month Warranty", desc: "Full Coverage" },
  { icon: Truck, label: "Same-Day Delivery", desc: "In Harare" },
  { icon: CreditCard, label: "Cash on Delivery", desc: "Pay on Arrival" },
];

const TrustBar = () => (
  <section className="bg-primary py-6">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trusts.map((t, i) => (
          <motion.div
            key={t.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 justify-center text-center md:text-left"
          >
            <t.icon className="h-8 w-8 text-accent shrink-0" />
            <div>
              <p className="font-display font-semibold text-sm text-primary-foreground">{t.label}</p>
              <p className="text-xs text-primary-foreground/60">{t.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBar;
