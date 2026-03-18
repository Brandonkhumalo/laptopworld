"use client";

import { useState, useEffect } from "react";
import { Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

interface CategoryData {
  id: number;
  name: string;
}

const Footer = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    api.categories.list().then((data: CategoryData[]) => setCategories(data)).catch(() => {});
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-display text-xl font-bold mb-3">LAPTOP WORLD</h3>
            <p className="text-sm text-primary-foreground/60 mb-4 max-w-xs">
              Zimbabwe's premier tech store. Genuine laptops, phones, accessories and all gadgets at unbeatable prices.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-accent transition-colors">Shop</Link></li>
              <li><Link href="/deals" className="hover:text-accent transition-colors">Deals</Link></li>
              <li><Link href="/wishlist" className="hover:text-accent transition-colors">Wishlist</Link></li>
              <li><Link href="/cart" className="hover:text-accent transition-colors">Cart</Link></li>
            </ul>
          </div>

          {categories.length > 0 && (
            <div>
              <h4 className="font-display font-semibold mb-3 text-sm uppercase tracking-wider">Categories</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/60">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.id}`} className="hover:text-accent transition-colors">{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-display font-semibold mb-3 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/60">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
                <span>First Street & George Silundika, Harare (inside Econet Wireless shop)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a href="tel:+263782482482" className="hover:text-accent transition-colors">0782 482 482</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a href="tel:+263771796666" className="hover:text-accent transition-colors">0771 796 666</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/40">
          <p>&copy; {new Date().getFullYear()} Laptop World. All rights reserved.</p>
          <p>Designed & Developed by{" "}
            <a href="https://tishanyq.co.zw" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline transition-colors">
              Tishanyq Digital
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
