"use client";

import Link from "next/link";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { getMediaUrl } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WishlistPage = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = async (productId: number) => {
    await addToCart(productId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="rounded-full bg-destructive/10 p-3">
            <Heart className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground" data-testid="text-wishlist-title">
              My Wishlist
            </h1>
            <p className="text-sm text-muted-foreground">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4" data-testid="text-empty-wishlist">Your wishlist is empty</p>
            <Link href="/shop" className="gradient-accent px-6 py-2.5 rounded-lg font-medium text-secondary-foreground inline-block" data-testid="link-browse-products">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => {
              const imageUrl = item.image ? getMediaUrl(item.image) : null;
              const price = item.deal_price ? parseFloat(item.deal_price) : parseFloat(item.price);
              const originalPrice = item.deal_price ? parseFloat(item.price) : null;

              return (
                <div key={item.id} className="rounded-xl bg-card border border-border shadow-product overflow-hidden" data-testid={`card-wishlist-${item.id}`}>
                  <Link href={`/product/${item.id}`}>
                    <div className="aspect-square bg-muted p-4">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.name} className="h-full w-full object-contain" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">No Image</div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <p className="text-xs text-accent font-medium uppercase tracking-wider mb-1">{item.category_name}</p>
                    <h3 className="font-display font-semibold text-sm text-card-foreground line-clamp-2 mb-2 min-h-[2.5rem]" data-testid={`text-wishlist-name-${item.id}`}>
                      {item.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-display text-lg font-bold text-accent">${price.toFixed(2)}</span>
                      {originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item.id)}
                        className="flex-1 flex items-center justify-center gap-2 gradient-accent py-2 rounded-lg text-xs font-semibold text-secondary-foreground"
                        data-testid={`button-wishlist-add-cart-${item.id}`}
                      >
                        <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-2 rounded-lg border border-border hover:bg-destructive/10 text-destructive"
                        data-testid={`button-wishlist-remove-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default WishlistPage;
