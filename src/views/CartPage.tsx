"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowLeft, Loader2, MapPin, Truck, Store } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { api } from "@/lib/api";
import AddressPicker from "@/components/AddressPicker";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_BASE = '';

interface DeliveryFees {
  harare_fee: string;
  outside_harare_fee: string;
}

const CartPage = () => {
  const { items, updateQuantity, removeFromCart, getTotal, refreshCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    fulfillment_type: 'collection', delivery_address: '',
    delivery_lat: null as number | null, delivery_lng: null as number | null,
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [deliveryFees, setDeliveryFees] = useState<DeliveryFees | null>(null);
  const [mapsApiKey, setMapsApiKey] = useState('');
  const [isHarare, setIsHarare] = useState(true);
  const [addressConfirmed, setAddressConfirmed] = useState(false);

  useEffect(() => {
    api.deliverySettings.get().then(setDeliveryFees).catch(() => {});
    api.mapsKey().then((data: { key: string }) => setMapsApiKey(data.key)).catch(() => {});
  }, []);

  const deliveryFee = formData.fulfillment_type === 'delivery' && deliveryFees
    ? parseFloat(isHarare ? deliveryFees.harare_fee : deliveryFees.outside_harare_fee)
    : 0;

  const grandTotal = getTotal() + deliveryFee;

  const handleAddressConfirm = (data: { address: string; lat: number; lng: number; isHarare: boolean }) => {
    setFormData(prev => ({
      ...prev,
      delivery_address: data.address,
      delivery_lat: data.lat,
      delivery_lng: data.lng,
    }));
    setIsHarare(data.isHarare);
    setAddressConfirmed(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fulfillment_type === 'delivery' && !addressConfirmed) {
      alert('Please confirm your delivery address on the map.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await api.checkout({
        ...formData,
        delivery_fee: deliveryFee,
      });
      refreshCart();
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6" data-testid="button-back">
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>

        <h1 className="font-display text-2xl font-bold text-foreground mb-6" data-testid="text-cart-title">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4" data-testid="text-empty-cart">Your cart is empty</p>
            <Link href="/" className="gradient-accent px-6 py-2.5 rounded-lg font-medium text-secondary-foreground inline-block" data-testid="link-shop-now">Shop Now</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => {
                const price = item.product.deal_price ? parseFloat(item.product.deal_price) : parseFloat(item.product.price);
                const imageUrl = item.product.image ? (item.product.image.startsWith('http') ? item.product.image : `${API_BASE}${item.product.image}`) : null;
                return (
                  <div key={item.id} className="rounded-xl bg-card border border-border p-4 shadow-product flex items-center gap-4" data-testid={`card-cart-item-${item.id}`}>
                    {imageUrl && <img src={imageUrl} alt={item.product.name} className="h-20 w-20 object-contain rounded-lg bg-muted" />}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate" data-testid={`text-cart-item-name-${item.id}`}>{item.product.name}</h3>
                      <p className="text-sm text-accent font-bold" data-testid={`text-cart-item-price-${item.id}`}>${price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-lg border border-border hover:bg-muted" data-testid={`button-decrease-${item.id}`}><Minus className="h-4 w-4" /></button>
                      <span className="w-8 text-center text-sm font-medium" data-testid={`text-quantity-${item.id}`}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-lg border border-border hover:bg-muted" data-testid={`button-increase-${item.id}`}><Plus className="h-4 w-4" /></button>
                    </div>
                    <span className="font-bold text-foreground w-20 text-right" data-testid={`text-item-total-${item.id}`}>${(price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" data-testid={`button-remove-${item.id}`}><Trash2 className="h-4 w-4" /></button>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="rounded-xl bg-card border border-border p-6 shadow-product">
                <h2 className="font-display text-lg font-bold text-foreground mb-4" data-testid="text-order-summary">Order Summary</h2>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium" data-testid="text-subtotal">${getTotal().toFixed(2)}</span>
                </div>
                <div className="border-t border-border mt-4 pt-4 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-accent text-lg" data-testid="text-total">${getTotal().toFixed(2)}</span>
                </div>
                <button onClick={() => setShowCheckout(true)} className="w-full gradient-accent mt-4 py-2.5 rounded-lg font-semibold text-secondary-foreground" data-testid="button-checkout">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {showCheckout && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <form onSubmit={handleCheckout} className="bg-card rounded-xl border border-border p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl space-y-4" data-testid="form-checkout">
              <h2 className="font-display text-xl font-bold text-foreground">Checkout</h2>
              <p className="text-sm text-muted-foreground">You will be redirected to Paynow to complete your payment.</p>
              <input value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} placeholder="Full name" required className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" data-testid="input-checkout-name" />
              <input type="email" value={formData.customer_email} onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })} placeholder="Email address" required className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" data-testid="input-checkout-email" />
              <input type="tel" value={formData.customer_phone} onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })} placeholder="Phone number" required className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" data-testid="input-checkout-phone" />

              <div>
                <label className="text-sm font-medium block mb-2">How would you like to receive your order?</label>
                <div className="flex gap-3">
                  <label className={`flex-1 rounded-lg border p-3 cursor-pointer text-center text-sm flex flex-col items-center gap-1.5 transition-all ${formData.fulfillment_type === 'collection' ? 'border-accent bg-accent/10 shadow-sm' : 'border-border hover:border-muted-foreground/30'}`}>
                    <input type="radio" name="fulfillment" value="collection" checked={formData.fulfillment_type === 'collection'} onChange={(e) => { setFormData({ ...formData, fulfillment_type: e.target.value, delivery_address: '', delivery_lat: null, delivery_lng: null }); setAddressConfirmed(false); }} className="sr-only" />
                    <Store className="h-5 w-5" />
                    Collection
                    <span className="text-xs text-muted-foreground">Pick up in store</span>
                  </label>
                  <label className={`flex-1 rounded-lg border p-3 cursor-pointer text-center text-sm flex flex-col items-center gap-1.5 transition-all ${formData.fulfillment_type === 'delivery' ? 'border-accent bg-accent/10 shadow-sm' : 'border-border hover:border-muted-foreground/30'}`}>
                    <input type="radio" name="fulfillment" value="delivery" checked={formData.fulfillment_type === 'delivery'} onChange={(e) => { setFormData({ ...formData, fulfillment_type: e.target.value }); setAddressConfirmed(false); }} className="sr-only" />
                    <Truck className="h-5 w-5" />
                    Delivery
                    {deliveryFees && <span className="text-xs text-muted-foreground">From ${parseFloat(deliveryFees.harare_fee).toFixed(2)}</span>}
                  </label>
                </div>
              </div>

              {formData.fulfillment_type === 'delivery' && (
                <div className="space-y-3">
                  {deliveryFees && (
                    <div className="rounded-lg bg-muted/50 border border-border p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium">Delivery Fees</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className={`rounded-md p-2 text-center ${isHarare && addressConfirmed ? 'bg-accent/15 border border-accent/30' : 'bg-background border border-border'}`}>
                          <div className="font-semibold text-sm">${parseFloat(deliveryFees.harare_fee).toFixed(2)}</div>
                          <div className="text-muted-foreground">Harare</div>
                        </div>
                        <div className={`rounded-md p-2 text-center ${!isHarare && addressConfirmed ? 'bg-accent/15 border border-accent/30' : 'bg-background border border-border'}`}>
                          <div className="font-semibold text-sm">${parseFloat(deliveryFees.outside_harare_fee).toFixed(2)}</div>
                          <div className="text-muted-foreground">Outside Harare</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {mapsApiKey ? (
                    <AddressPicker
                      apiKey={mapsApiKey}
                      onAddressConfirm={handleAddressConfirm}
                    />
                  ) : (
                    <div className="space-y-2">
                      <textarea
                        value={formData.delivery_address}
                        onChange={(e) => {
                          setFormData({ ...formData, delivery_address: e.target.value });
                          setAddressConfirmed(e.target.value.trim().length > 0);
                        }}
                        placeholder="Enter your delivery address"
                        required
                        rows={3}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
                        data-testid="input-checkout-address"
                      />
                      <div className="flex gap-2">
                        <label className={`flex-1 rounded-md border p-2 cursor-pointer text-center text-xs ${isHarare ? 'border-accent bg-accent/10' : 'border-border'}`}>
                          <input type="radio" name="area" checked={isHarare} onChange={() => setIsHarare(true)} className="sr-only" />
                          Harare
                        </label>
                        <label className={`flex-1 rounded-md border p-2 cursor-pointer text-center text-xs ${!isHarare ? 'border-accent bg-accent/10' : 'border-border'}`}>
                          <input type="radio" name="area" checked={!isHarare} onChange={() => setIsHarare(false)} className="sr-only" />
                          Outside Harare
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Order notes (optional)" rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm" data-testid="input-checkout-notes" />

              <div className="rounded-lg bg-muted/50 border border-border p-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${getTotal().toFixed(2)}</span>
                </div>
                {formData.fulfillment_type === 'delivery' && deliveryFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t border-border pt-1.5">
                  <span>Total</span>
                  <span className="text-accent" data-testid="text-checkout-total">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCheckout(false)} className="flex-1 py-2.5 rounded-lg border border-border font-medium text-sm" data-testid="button-cancel-checkout">Cancel</button>
                <button
                  type="submit"
                  disabled={submitting || (formData.fulfillment_type === 'delivery' && !addressConfirmed)}
                  className="flex-1 gradient-accent py-2.5 rounded-lg font-semibold text-secondary-foreground disabled:opacity-50 flex items-center justify-center gap-2"
                  data-testid="button-place-order"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Pay $${grandTotal.toFixed(2)}`
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
