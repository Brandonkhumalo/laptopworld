import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

const ContactMapSection = () => (
  <section id="contact" className="py-16 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground" data-testid="text-find-us-title">
          Find <span className="text-gradient">Us</span>
        </h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Visit our store or get in touch — we'd love to hear from you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-3 rounded-2xl overflow-hidden shadow-product border border-border min-h-[300px] md:min-h-[400px]"
        >
          <iframe
            title="Mbuluundi Investments Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.5!2d31.0432!3d-17.7935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a4f09ea0b7a1%3A0x5a5d5d5d5d5d5d5d!2sRuvimbo%20Mall%2C%204%20David%20Morgan%20Crescent%2C%20Avondale%2C%20Harare%2C%20Zimbabwe!5e0!3m2!1sen!2szw!4v1700000000000!5m2!1sen!2szw"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "400px" }}
            allowFullScreen
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
            data-testid="iframe-map"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-2 flex flex-col gap-4"
        >
          <div className="rounded-xl bg-card border border-border p-5 shadow-product flex items-start gap-4" data-testid="card-store-address">
            <div className="rounded-lg bg-accent/10 p-3 shrink-0">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground text-sm">Our Store</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ruvimbo Mall, Shop 13 & 14, 4 David Morgan Crescent, Avondale, Harare
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-card border border-border p-5 shadow-product flex items-start gap-4">
            <div className="rounded-lg bg-accent/10 p-3 shrink-0">
              <Phone className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground text-sm">Call Us</h3>
              <a href="tel:+2638677210547" className="text-sm text-muted-foreground mt-1 block hover:text-accent transition-colors" data-testid="link-call-us">
                +263 8677210547
              </a>
            </div>
          </div>

          <div className="rounded-xl bg-card border border-border p-5 shadow-product flex items-start gap-4">
            <div className="rounded-lg bg-accent/10 p-3 shrink-0">
              <Mail className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground text-sm">Email</h3>
              <a href="mailto:mbuluundi@gmail.com" className="text-sm text-muted-foreground mt-1 block hover:text-accent transition-colors" data-testid="link-email">
                mbuluundi@gmail.com
              </a>
            </div>
          </div>

          <div className="rounded-xl bg-card border border-border p-5 shadow-product flex items-start gap-4">
            <div className="rounded-lg bg-accent/10 p-3 shrink-0">
              <MessageCircle className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground text-sm">WhatsApp</h3>
              <a
                href="https://wa.me/2638677210547"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground mt-1 block hover:text-accent transition-colors"
                data-testid="link-whatsapp"
              >
                Chat with us instantly
              </a>
            </div>
          </div>

          <div className="rounded-xl bg-card border border-border p-5 shadow-product flex items-start gap-4">
            <div className="rounded-lg bg-accent/10 p-3 shrink-0">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground text-sm">Business Hours</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Mon – Fri: 8:00 AM – 5:00 PM
              </p>
              <p className="text-sm text-muted-foreground">
                Sat: 9:00 AM – 2:00 PM
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

export default ContactMapSection;
