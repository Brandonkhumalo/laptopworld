import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: number;
  image: string | null;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  dealPrice?: number;
  savePercentage?: number;
  badge?: string;
  index: number;
}

const API_BASE = '';

const ProductCard = ({ id, image, name, category, price, originalPrice, dealPrice, savePercentage, badge, index }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const displayPrice = dealPrice ?? price;
  const showOriginal = dealPrice ? price : originalPrice;
  const discount = savePercentage ? Math.round(savePercentage) : (showOriginal ? Math.round(((showOriginal - displayPrice) / showOriginal) * 100) : 0);
  const wishlisted = isInWishlist(id);

  const imageUrl = image ? (image.startsWith('http') ? image : `${API_BASE}${image}`) : null;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(id);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id,
      name,
      price: String(price),
      deal_price: dealPrice ? String(dealPrice) : null,
      image,
      category_name: category,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group relative rounded-xl bg-card shadow-product overflow-hidden transition-shadow duration-300 hover:shadow-hover"
      data-testid={`card-product-${id}`}
    >
      <div className="absolute top-3 left-3 z-10 flex gap-1.5">
        {badge && (
          <span className="rounded-full gradient-accent px-2.5 py-0.5 text-[10px] font-bold uppercase text-secondary-foreground" data-testid={`badge-product-${id}`}>
            {badge}
          </span>
        )}
        {discount > 0 && (
          <span className="rounded-full bg-success px-2.5 py-0.5 text-[10px] font-bold text-success-foreground" data-testid={`discount-product-${id}`}>
            -{discount}%
          </span>
        )}
      </div>

      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 z-10 rounded-full p-1.5 transition-colors ${wishlisted ? 'bg-destructive/10 text-destructive' : 'bg-card/80 text-muted-foreground hover:text-destructive hover:bg-destructive/10'}`}
        aria-label={wishlisted ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
        data-testid={`button-wishlist-${id}`}
      >
        <Heart className={`h-4 w-4 ${wishlisted ? 'fill-current' : ''}`} />
      </button>

      <Link to={`/product/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted p-6">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              data-testid={`img-product-${id}`}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <p className="text-xs text-accent font-medium uppercase tracking-wider mb-1" data-testid={`text-category-${id}`}>{category}</p>
        <h3 className="font-display font-semibold text-sm text-card-foreground line-clamp-2 mb-2 min-h-[2.5rem]" data-testid={`text-name-${id}`}>
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-lg font-bold text-accent" data-testid={`text-price-${id}`}>
              ${displayPrice.toFixed(2)}
            </span>
            {showOriginal && showOriginal !== displayPrice && (
              <span className="text-xs text-muted-foreground line-through" data-testid={`text-original-price-${id}`}>
                ${showOriginal.toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="rounded-full bg-primary p-2 text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label={`Add ${name} to cart`}
            data-testid={`button-add-cart-${id}`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
