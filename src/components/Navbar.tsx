"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, Menu, X, Phone, ChevronRight, Percent, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { api } from "@/lib/api";
import { Smartphone, Laptop, Watch, Headphones, Gamepad2, Cable, Package, Camera, Tv, Speaker, Tablet, Monitor } from "lucide-react";

const logoImg = "/logo.png";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone, Laptop, Watch, Headphones, Gamepad2, Cable, Package, Camera, Tv, Speaker, Tablet, Monitor,
};

interface CategoryData {
  id: number;
  name: string;
  icon: string;
  product_count: number;
}

interface DealData {
  id: number;
  product: number;
  product_name: string;
  deal_price: string;
  save_percentage: string;
  active: boolean;
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [deals, setDeals] = useState<DealData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const router = useRouter();
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    api.categories.list().then((data: CategoryData[]) => setCategories(data)).catch(() => {});
    api.deals.list().then((data: DealData[]) => setDeals(data.filter((d: DealData) => d.active))).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0" data-testid="link-home">
          <img src={logoImg} alt="Laptop World" className="h-10 w-auto" data-testid="img-logo" />
        </Link>

        <nav className="hidden lg:flex items-center gap-6" data-testid="nav-desktop">
          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter('Shop')}
            onMouseLeave={handleDropdownLeave}
          >
            <Link
              href="/shop"
              className={`text-sm font-medium py-2 transition-colors duration-200 ${activeDropdown === 'Shop' ? 'text-accent' : 'text-primary-foreground/80 hover:text-accent'}`}
              data-testid="link-shop"
            >
              Shop
            </Link>
            <AnimatePresence>
              {activeDropdown === 'Shop' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-xl overflow-hidden z-50"
                  onMouseEnter={() => handleDropdownEnter('Shop')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link href="/shop" className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors" onClick={() => setActiveDropdown(null)} data-testid="dropdown-all-products">
                    <Package className="h-4 w-4 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-foreground">All Products</p>
                      <p className="text-xs text-muted-foreground">Browse everything</p>
                    </div>
                  </Link>
                  <Link href="/deals" className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors border-t border-border/50" onClick={() => setActiveDropdown(null)} data-testid="dropdown-deals">
                    <Percent className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Hot Deals</p>
                      <p className="text-xs text-muted-foreground">{deals.length > 0 ? `${deals.length} active deal${deals.length > 1 ? 's' : ''}` : 'Check for savings'}</p>
                    </div>
                  </Link>
                  <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors border-t border-border/50" onClick={() => setActiveDropdown(null)} data-testid="dropdown-wishlist">
                    <Heart className="h-4 w-4 text-destructive" />
                    <div>
                      <p className="text-sm font-medium text-foreground">My Wishlist</p>
                      <p className="text-xs text-muted-foreground">{wishlistCount} saved item{wishlistCount !== 1 ? 's' : ''}</p>
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter('Deals')}
            onMouseLeave={handleDropdownLeave}
          >
            <Link
              href="/deals"
              className={`text-sm font-medium py-2 transition-colors duration-200 ${activeDropdown === 'Deals' ? 'text-accent' : 'text-primary-foreground/80 hover:text-accent'}`}
              data-testid="link-deals"
            >
              Deals
            </Link>
            <AnimatePresence>
              {activeDropdown === 'Deals' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-card border border-border shadow-xl overflow-hidden z-50"
                  onMouseEnter={() => handleDropdownEnter('Deals')}
                  onMouseLeave={handleDropdownLeave}
                >
                  {deals.length > 0 ? (
                    <>
                      {deals.slice(0, 4).map((deal) => (
                        <Link
                          key={deal.id}
                          href={`/product/${deal.product}`}
                          className="flex items-center justify-between px-4 py-3 hover:bg-muted transition-colors border-b border-border/50 last:border-0"
                          onClick={() => setActiveDropdown(null)}
                          data-testid={`dropdown-deal-${deal.id}`}
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground line-clamp-1">{deal.product_name}</p>
                            <p className="text-xs text-muted-foreground">${deal.deal_price}</p>
                          </div>
                          <span className="rounded-full bg-success/20 px-2 py-0.5 text-xs font-bold text-success shrink-0">
                            -{Math.round(parseFloat(deal.save_percentage))}%
                          </span>
                        </Link>
                      ))}
                      <Link href="/deals" className="flex items-center justify-center gap-1 px-4 py-2.5 text-xs font-medium text-accent hover:bg-muted transition-colors border-t border-border/50" onClick={() => setActiveDropdown(null)}>
                        View All Deals <ChevronRight className="h-3 w-3" />
                      </Link>
                    </>
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <Percent className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No active deals right now</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter('Categories')}
            onMouseLeave={handleDropdownLeave}
          >
            <Link
              href="/shop"
              className={`text-sm font-medium py-2 transition-colors duration-200 ${activeDropdown === 'Categories' ? 'text-accent' : 'text-primary-foreground/80 hover:text-accent'}`}
              data-testid="link-categories"
            >
              Categories
            </Link>
            <AnimatePresence>
              {activeDropdown === 'Categories' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 rounded-xl bg-card border border-border shadow-xl overflow-hidden z-50"
                  style={{ width: 'max-content', minWidth: '320px', maxWidth: '600px' }}
                  onMouseEnter={() => handleDropdownEnter('Categories')}
                  onMouseLeave={handleDropdownLeave}
                >
                  {categories.length > 0 ? (
                    <div className="p-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {categories.map((cat) => {
                          const Icon = iconMap[cat.icon] || Package;
                          return (
                            <Link
                              key={cat.id}
                              href={`/category/${cat.id}`}
                              className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted transition-colors"
                              onClick={() => setActiveDropdown(null)}
                              data-testid={`dropdown-category-${cat.id}`}
                            >
                              <div className="rounded-full bg-accent/10 p-2">
                                <Icon className="h-4 w-4 text-accent" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{cat.name}</p>
                                <p className="text-xs text-muted-foreground">{cat.product_count} item{cat.product_count !== 1 ? 's' : ''}</p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <Package className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No categories yet</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/about"
            className="text-sm font-medium py-2 transition-colors duration-200 text-primary-foreground/80 hover:text-accent"
            data-testid="link-about"
          >
            About
          </Link>

          <Link
            href="/amenities"
            className="text-sm font-medium py-2 transition-colors duration-200 text-primary-foreground/80 hover:text-accent"
            data-testid="link-amenities"
          >
            Other Services
          </Link>

          <div
            className="relative"
            onMouseEnter={() => handleDropdownEnter('Contact')}
            onMouseLeave={handleDropdownLeave}
          >
            <a
              href="/#contact"
              className={`text-sm font-medium py-2 transition-colors duration-200 ${activeDropdown === 'Contact' ? 'text-accent' : 'text-primary-foreground/80 hover:text-accent'}`}
              data-testid="link-contact"
            >
              Contact
            </a>
            <AnimatePresence>
              {activeDropdown === 'Contact' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-64 rounded-xl bg-card border border-border shadow-xl overflow-hidden z-50"
                  onMouseEnter={() => handleDropdownEnter('Contact')}
                  onMouseLeave={handleDropdownLeave}
                >
                  <div className="p-4 space-y-3">
                    <a href="tel:+263782482482" className="flex items-center gap-3 text-sm text-foreground hover:text-accent transition-colors">
                      <Phone className="h-4 w-4 text-accent" />
                      0782 482 482
                    </a>
                    <a href="tel:+263771796666" className="flex items-center gap-3 text-sm text-foreground hover:text-accent transition-colors">
                      <Phone className="h-4 w-4 text-accent" />
                      0771 796 666
                    </a>
                    <a href="tel:+2632427618168" className="flex items-center gap-3 text-sm text-foreground hover:text-accent transition-colors">
                      <Phone className="h-4 w-4 text-accent" />
                      0242 761 816-8
                    </a>
                    <a href="tel:+263719004400" className="flex items-center gap-3 text-sm text-foreground hover:text-accent transition-colors">
                      <Phone className="h-4 w-4 text-accent" />
                      0719 004 400
                    </a>
                    <a href="tel:+263719700555" className="flex items-center gap-3 text-sm text-foreground hover:text-accent transition-colors">
                      <Phone className="h-4 w-4 text-accent" />
                      0719 700 555/4
                    </a>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 text-accent shrink-0" />
                      First St & George Silundika, Harare (inside Econet shop)
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-accent shrink-0" />
                      Mon-Sat: 8AM - 6PM
                    </div>
                  </div>
                  <a href="/#contact" className="flex items-center justify-center gap-1 px-4 py-2.5 text-xs font-medium text-accent hover:bg-muted transition-colors border-t border-border" onClick={() => setActiveDropdown(null)}>
                    View Full Contact Info <ChevronRight className="h-3 w-3" />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full bg-primary-foreground/10 border border-primary-foreground/20 px-4 py-2 pr-10 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              data-testid="input-search"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2" data-testid="button-search">
              <Search className="h-4 w-4 text-primary-foreground/50 hover:text-accent transition-colors" />
            </button>
          </form>
        </div>

        <div className="flex items-center gap-3">
          <a href="tel:+263782482482" className="hidden lg:flex items-center gap-1 text-xs text-primary-foreground/80 hover:text-accent transition-colors" data-testid="link-phone">
            <Phone className="h-3.5 w-3.5" />
            <span>0782 482 482</span>
          </a>
          <Link href="/wishlist" className="relative p-2 text-primary-foreground/80 hover:text-accent transition-colors" aria-label="Wishlist" data-testid="link-wishlist">
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground" data-testid="text-wishlist-count">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative p-2 text-primary-foreground/80 hover:text-accent transition-colors" aria-label="Cart" data-testid="link-cart">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground" data-testid="text-cart-count">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            className="lg:hidden p-2 text-primary-foreground/80"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            data-testid="button-mobile-menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden border-t border-primary-foreground/10"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <form onSubmit={handleMobileSearch} className="relative md:hidden">
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-full bg-primary-foreground/10 border border-primary-foreground/20 px-4 py-2 pr-10 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
                  data-testid="input-search-mobile"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2" data-testid="button-search-mobile">
                  <Search className="h-4 w-4 text-primary-foreground/50" />
                </button>
              </form>

              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="text-primary-foreground/80 hover:text-accent py-2 border-b border-primary-foreground/10 transition-colors"
                data-testid="link-mobile-shop"
              >
                Shop
              </Link>
              <Link
                href="/deals"
                onClick={() => setMobileOpen(false)}
                className="text-primary-foreground/80 hover:text-accent py-2 border-b border-primary-foreground/10 transition-colors"
                data-testid="link-mobile-deals"
              >
                Deals
              </Link>
              <Link
                href="/shop"
                onClick={() => setMobileOpen(false)}
                className="text-primary-foreground/80 hover:text-accent py-2 border-b border-primary-foreground/10 transition-colors"
                data-testid="link-mobile-categories"
              >
                Categories
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="text-primary-foreground/80 hover:text-accent py-2 border-b border-primary-foreground/10 transition-colors"
                data-testid="link-mobile-about"
              >
                About
              </Link>
              <Link
                href="/amenities"
                onClick={() => setMobileOpen(false)}
                className="text-primary-foreground/80 hover:text-accent py-2 border-b border-primary-foreground/10 transition-colors"
                data-testid="link-mobile-amenities"
              >
                Amenities
              </Link>
              <a
                href="/#contact"
                onClick={() => setMobileOpen(false)}
                className="text-primary-foreground/80 hover:text-accent py-2 border-b border-primary-foreground/10 transition-colors"
                data-testid="link-mobile-contact"
              >
                Contact
              </a>
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="text-primary-foreground/80 hover:text-accent py-2 border-b border-primary-foreground/10 transition-colors flex items-center gap-2"
                data-testid="link-mobile-wishlist"
              >
                <Heart className="h-4 w-4" /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
