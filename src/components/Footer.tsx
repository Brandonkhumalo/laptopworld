import { useState, useEffect } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
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
            <h3 className="font-display text-xl font-bold mb-3">MBULUUNDI</h3>
            <p className="text-sm text-primary-foreground/60 mb-4 max-w-xs">
              Zimbabwe's premier tech store. Genuine products, unbeatable prices, and exceptional service since 2020.
            </p>
            <p className="text-xs text-primary-foreground/40">
              Mbuluundi Investments (Pvt) Ltd — Registered in Zimbabwe
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-accent transition-colors">Shop</Link></li>
              <li><Link to="/deals" className="hover:text-accent transition-colors">Deals</Link></li>
              <li><Link to="/wishlist" className="hover:text-accent transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-accent transition-colors">Cart</Link></li>
            </ul>
          </div>

          {categories.length > 0 && (
            <div>
              <h4 className="font-display font-semibold mb-3 text-sm uppercase tracking-wider">Categories</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/60">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link to={`/category/${cat.id}`} className="hover:text-accent transition-colors">{cat.name}</Link>
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
                <span>Ruvimbo Mall, Shop 13 & 14, 4 David Morgan Crescent, Avondale, Harare</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a href="tel:+2638677210547" className="hover:text-accent transition-colors">+263 8677210547</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a href="mailto:mbuluundi@gmail.com" className="hover:text-accent transition-colors break-all">mbuluundi@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/40">
          <p>© {new Date().getFullYear()} Mbuluundi Investments (Pvt) Ltd. All rights reserved.</p>
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
