import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Smartphone, Laptop, Watch, Headphones, Gamepad2, Cable, Package, Camera, Tv, Speaker, Tablet, Monitor } from "lucide-react";
import { api } from "@/lib/api";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone, Laptop, Watch, Headphones, Gamepad2, Cable, Package, Camera, Tv, Speaker, Tablet, Monitor,
};

interface CategoryData {
  id: number;
  name: string;
  icon: string;
  product_count: number;
}

const Categories = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.categories.list().then((data: CategoryData[]) => {
      setCategories(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="categories" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-10">
            Shop by <span className="text-gradient">Category</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-card h-36" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section id="categories" className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground" data-testid="text-categories-title">
            Shop by <span className="text-gradient">Category</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon] || Package;
            return (
              <motion.div key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.03 }}
              >
                <Link
                  to={`/category/${cat.id}`}
                  className="group flex flex-col items-center gap-3 rounded-xl bg-card p-6 shadow-product transition-shadow hover:shadow-hover cursor-pointer"
                  data-testid={`link-category-${cat.id}`}
                >
                  <div className="rounded-full bg-accent/10 p-4 group-hover:bg-accent/20 transition-colors">
                    <Icon className="h-8 w-8 text-accent" />
                  </div>
                  <span className="font-display font-semibold text-sm text-card-foreground text-center" data-testid={`text-category-name-${cat.id}`}>
                    {cat.name}
                  </span>
                  <span className="text-xs text-muted-foreground" data-testid={`text-category-count-${cat.id}`}>{cat.product_count} items</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
