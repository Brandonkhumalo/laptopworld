import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Product {
  id: number;
  name: string;
  category_name: string;
  price: string;
  deal_price: string | null;
  active_deal: { save_percentage: string } | null;
  image: string | null;
  badge: string;
}

interface Category {
  id: number;
  name: string;
}

const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.categories.get(parseInt(id)),
      api.products.list({ category: parseInt(id) }),
    ]).then(([cat, prods]) => {
      setCategory(cat);
      setProducts(Array.isArray(prods) ? prods : prods.results || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8" data-testid="text-category-title">
          {loading ? 'Loading...' : category?.name || 'Category'}
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-muted h-72" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground py-16" data-testid="text-no-products">No products in this category yet.</p>
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
                dealPrice={p.deal_price ? parseFloat(p.deal_price) : undefined}
                originalPrice={p.deal_price ? parseFloat(p.price) : undefined}
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

export default CategoryPage;
