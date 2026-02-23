import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";

const PickupBanner = () => (
  <section className="py-16 bg-muted/50">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Buy Online, <span className="text-gradient">Pick Up in Store</span>
          </h2>
          <p className="text-muted-foreground mb-4">
            Purchase your items online and pick them up at our store in one or two hours, sometimes even less. 
            Save on shipping fees and avoid shipping time.
          </p>
          <p className="text-muted-foreground text-sm">
            Your order will be held at the store for two calendar days. We'll send you a reminder email 
            one day before we return the merchandise to stock.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4"
        >
          <div className="rounded-xl bg-card p-6 shadow-product flex items-start gap-4">
            <MapPin className="h-8 w-8 text-accent shrink-0 mt-1" />
            <div>
              <h3 className="font-display font-semibold text-foreground">Visit Our Store</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ruvimbo Mall, Shop 13 & 14, 4 David Morgan Crescent, Avondale, Harare
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-card p-6 shadow-product flex items-start gap-4">
            <Clock className="h-8 w-8 text-accent shrink-0 mt-1" />
            <div>
              <h3 className="font-display font-semibold text-foreground">2-Day Hold</h3>
              <p className="text-sm text-muted-foreground mt-1">
                We'll keep your order for two days so you can pick it up at a convenient time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default PickupBanner;
