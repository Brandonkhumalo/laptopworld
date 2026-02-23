import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Minus, Plus, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { specsToGrouped } from "@/lib/specTemplates";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_BASE = '';

interface ProductImageData {
  id: number;
  image: string;
  order: number;
}

interface Product {
  id: number;
  name: string;
  category: number;
  category_name: string;
  category_type: string;
  price: string;
  description: string;
  key_features: string[];
  specifications: Record<string, string>;
  image: string | null;
  images: ProductImageData[];
  badge: string;
  stock: number;
  sku: string;
  condition: string;
  warranty: string;
  brand: string;
  deal_price: string | null;
  active_deal: { deal_price: string; save_percentage: string } | null;
}

function getImageUrl(img: string | null) {
  if (!img) return null;
  return img.startsWith('http') ? img : `${API_BASE}${img}`;
}

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'specs'>('about');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    if (!id) return;
    api.products.get(parseInt(id)).then((data: Product) => {
      setProduct(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    await addToCart(product.id, quantity);
    setAdding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-muted rounded-xl aspect-square" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => <div key={i} className="bg-muted rounded-lg h-16 w-16" />)}
              </div>
            </div>
            <div className="lg:col-span-4 space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div className="h-10 bg-muted rounded w-1/2" />
              <div className="h-12 bg-muted rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/" className="text-accent hover:underline">Go back home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const displayPrice = product.deal_price ? parseFloat(product.deal_price) : parseFloat(product.price);
  const originalPrice = product.deal_price ? parseFloat(product.price) : null;

  const allImages: string[] = [];
  if (product.image) {
    const url = getImageUrl(product.image);
    if (url) allImages.push(url);
  }
  if (product.images) {
    for (const img of product.images) {
      const url = getImageUrl(img.image);
      if (url) allImages.push(url);
    }
  }

  const specs = product.specifications && typeof product.specifications === 'object' ? product.specifications : {};
  const groupedSpecs = specsToGrouped(specs, product.category_type || 'other');
  const features = product.key_features && Array.isArray(product.key_features) ? product.key_features.filter(f => f && f.trim()) : [];

  const prevImage = () => setSelectedImageIdx(i => i > 0 ? i - 1 : allImages.length - 1);
  const nextImage = () => setSelectedImageIdx(i => i < allImages.length - 1 ? i + 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 lg:mb-6" data-testid="link-back">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {product.active_deal && (
          <div className="inline-block mb-4">
            <span className="rounded-lg bg-success px-4 py-2 text-sm font-bold text-success-foreground" data-testid="badge-save-amount">
              SAVE ${(parseFloat(product.price) - parseFloat(product.active_deal.deal_price)).toFixed(2)}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-card border border-border overflow-hidden shadow-product relative">
              {allImages.length > 0 ? (
                <>
                  <img
                    src={allImages[selectedImageIdx]}
                    alt={product.name}
                    className="w-full aspect-square object-contain p-6 lg:p-8"
                    data-testid="img-product-detail"
                  />
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-card transition-colors"
                        data-testid="button-prev-image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-card transition-colors"
                        data-testid="button-next-image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full">
                        {selectedImageIdx + 1} of {allImages.length}
                      </p>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full aspect-square flex items-center justify-center bg-muted text-muted-foreground">No Image</div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="mt-3">
                <p className="text-xs text-muted-foreground mb-2">Product Gallery</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`shrink-0 h-16 w-16 rounded-lg border-2 overflow-hidden transition-colors ${
                        idx === selectedImageIdx ? 'border-accent' : 'border-border hover:border-accent/50'
                      }`}
                      data-testid={`button-gallery-thumb-${idx}`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <h1 className="font-display text-xl lg:text-2xl font-bold text-foreground mb-1" data-testid="text-product-name">
              {product.name}
            </h1>
            <p className="text-xs text-muted-foreground mb-4" data-testid="text-product-sku">
              Product Code: {product.sku}
            </p>

            {features.length > 0 && (
              <ul className="space-y-1.5 mb-4" data-testid="list-key-features">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="text-accent mt-0.5">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {product.warranty && (
              <p className="text-sm text-muted-foreground mb-2" data-testid="text-warranty">
                Warranty: {product.warranty}
              </p>
            )}

            {product.condition && product.condition !== 'new' && (
              <p className="text-sm text-muted-foreground mb-2" data-testid="text-condition">
                Condition: {product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
              </p>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-xl bg-card border border-border p-4 lg:p-5 shadow-product lg:sticky lg:top-24 space-y-4">
              {originalPrice && (
                <p className="text-lg text-muted-foreground line-through" data-testid="text-product-original-price">
                  ${originalPrice.toFixed(2)}
                </p>
              )}
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-accent" data-testid="text-product-price">
                  ${displayPrice.toFixed(2)}
                </span>
                {product.active_deal && (
                  <span className="rounded-full bg-success px-2 py-0.5 text-xs font-bold text-success-foreground" data-testid="text-product-discount">
                    -{Math.round(parseFloat(product.active_deal.save_percentage))}%
                  </span>
                )}
              </div>

              {product.badge && (
                <span className="inline-block rounded-full gradient-accent px-3 py-1 text-xs font-bold uppercase text-secondary-foreground" data-testid="badge-product-detail">
                  {product.badge}
                </span>
              )}

              <p className="text-sm" data-testid="text-product-stock">
                {product.stock > 0 ? (
                  <span className="text-success font-medium">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-destructive font-medium">Out of Stock</span>
                )}
              </p>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2.5 hover:bg-muted rounded-l-lg" data-testid="button-qty-decrease">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 text-sm font-medium min-w-[3rem] text-center" data-testid="text-product-quantity">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2.5 hover:bg-muted rounded-r-lg" data-testid="button-qty-increase">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding || product.stock === 0}
                className="w-full flex items-center justify-center gap-2 gradient-accent px-6 py-3 rounded-lg font-semibold text-secondary-foreground disabled:opacity-50 transition-opacity"
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="h-4 w-4" />
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>

              <button
                onClick={() => toggleWishlist({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  deal_price: product.deal_price,
                  image: product.image,
                  category_name: product.category_name,
                })}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border transition-colors ${
                  isInWishlist(product.id)
                    ? 'border-destructive bg-destructive/10 text-destructive'
                    : 'border-border hover:border-destructive hover:bg-destructive/10 text-foreground hover:text-destructive'
                }`}
                data-testid="button-toggle-wishlist"
              >
                <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 lg:mt-12">
          <div className="border-b border-border">
            <div className="flex gap-0">
              <button
                onClick={() => setActiveTab('about')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'about'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                data-testid="button-tab-about"
              >
                About This Item
              </button>
              {groupedSpecs.length > 0 && (
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'specs'
                      ? 'border-accent text-accent'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid="button-tab-specs"
                >
                  Specifications
                </button>
              )}
            </div>
          </div>

          <div className="py-6 lg:py-8">
            {activeTab === 'about' && (
              <div data-testid="section-about">
                <h2 className="font-display text-xl font-bold text-foreground mb-4">{product.name}</h2>
                {product.description ? (
                  <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line max-w-4xl" data-testid="text-product-description">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">No description available for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6" data-testid="section-specs">
                {groupedSpecs.map((group) => (
                  <div key={group.title}>
                    <h3 className="font-display font-bold text-foreground mb-3 text-center border-b border-border pb-2" data-testid={`specs-group-${group.title}`}>
                      {group.title}
                    </h3>
                    <table className="w-full">
                      <tbody>
                        {group.items.map((item) => (
                          <tr key={item.label} className="border-b border-border/50 last:border-0">
                            <td className="py-2.5 pr-4 text-sm text-muted-foreground w-1/2">{item.label}</td>
                            <td className="py-2.5 text-sm font-medium text-foreground">{item.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
