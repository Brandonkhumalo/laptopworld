import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
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
  active_deal: { save_percentage: string; deal_price: string } | null;
  image: string | null;
  badge: string;
}

interface Category {
  id: number;
  name: string;
  product_count: number;
}

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    api.categories.list().then((data: Category[]) => setCategories(data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = {};
    if (selectedCategory) params.category = parseInt(selectedCategory);
    if (searchQuery) params.search = searchQuery;

    api.products.list(params).then((data: Product[] | { results: Product[] }) => {
      setProducts(Array.isArray(data) ? data : data.results || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).querySelector('input') as HTMLInputElement;
    setSearchQuery(input.value);
    if (input.value) {
      setSearchParams({ q: input.value });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoryFilter = (catId: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId) {
      newParams.set('category', catId);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6" data-testid="text-shop-title">
          All Products
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <input
              type="text"
              defaultValue={searchQuery}
              placeholder="Search products..."
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              data-testid="input-shop-search"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground" data-testid="button-shop-search">
              <Search className="h-4 w-4" />
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${!selectedCategory ? 'gradient-accent text-secondary-foreground' : 'bg-card border border-border text-foreground hover:bg-muted'}`}
              data-testid="button-filter-all"
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryFilter(String(cat.id))}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${selectedCategory === String(cat.id) ? 'gradient-accent text-secondary-foreground' : 'bg-card border border-border text-foreground hover:bg-muted'}`}
                data-testid={`button-filter-${cat.id}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-muted h-72" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground" data-testid="text-no-results">No products found.</p>
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

export default ShopPage;
