import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Percent } from "lucide-react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ActiveDeal {
  id: number;
  deal_price: string;
  save_percentage: string;
}

interface Product {
  id: number;
  name: string;
  category_name: string;
  price: string;
  deal_price: string | null;
  active_deal: ActiveDeal | null;
  image: string | null;
  badge: string;
}

interface Deal {
  id: number;
  product: number;
  product_name: string;
  deal_price: string;
  save_percentage: string;
  active: boolean;
}

const DealsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.deals.list().then(async (deals: Deal[]) => {
      const activeDeals = deals.filter((d: Deal) => d.active);
      if (activeDeals.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const productPromises = activeDeals.map((d: Deal) => api.products.get(d.product));
      const prods = await Promise.all(productPromises);
      setProducts(prods);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="rounded-full bg-success/20 p-3">
            <Percent className="h-6 w-6 text-success" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground" data-testid="text-deals-title">
              Current Deals
            </h1>
            <p className="text-sm text-muted-foreground">Don't miss out on these amazing savings!</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-muted h-72" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4" data-testid="text-no-deals">No active deals right now. Check back soon!</p>
            <Link to="/" className="gradient-accent px-6 py-2.5 rounded-lg font-medium text-secondary-foreground inline-block" data-testid="link-browse">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                id={p.id}
                image={p.image}
                name={p.name}
                category={p.category_name}
                price={parseFloat(p.price)}
                dealPrice={p.active_deal ? parseFloat(p.active_deal.deal_price) : undefined}
                originalPrice={p.active_deal ? parseFloat(p.price) : undefined}
                savePercentage={p.active_deal ? parseFloat(p.active_deal.save_percentage) : undefined}
                badge={p.badge}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DealsPage;
