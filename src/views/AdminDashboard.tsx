"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, getMediaUrl } from "@/lib/api";
import { getSpecSections } from "@/lib/specTemplates";
import { LogOut, Tag, Package, Star, Percent, ShoppingBag, Plus, Trash2, Edit, X, ChevronDown, Upload, Image as ImageIcon, Truck, MapPin, DollarSign } from "lucide-react";

const logoImg = "/logo.png";

type Tab = 'categories' | 'products' | 'top-picks' | 'deals' | 'orders' | 'delivery';

interface Category { id: number; name: string; icon: string; category_type: string; product_count: number }
interface ProductImage { id: number; image: string; order: number }
interface Product { id: number; name: string; category: number; category_name: string; category_type: string; price: string; description: string; key_features: string[]; specifications: Record<string, string>; image: string | null; images: ProductImage[]; badge: string; stock: number; sku: string; condition: string; warranty: string; brand: string; deal_price: string | null; active_deal: { id: number; deal_price: string; save_percentage: string } | null }
interface Deal { id: number; product: number; product_name: string; deal_price: string; save_percentage: string; active: boolean }
interface TopPick { id: number; product: Product; order: number; active: boolean }
interface OrderItem { id: number; product_name: string; quantity: number; price: string }
interface Order { id: number; order_number: string; customer_name: string; customer_email: string; customer_phone: string; delivery_address: string; delivery_lat: number | null; delivery_lng: number | null; delivery_fee: string; fulfillment_type: string; status: string; total: string; items: OrderItem[]; created_at: string }

const categoryNameMap: Record<string, { icon: string; type: string }> = {
  'phones': { icon: 'Smartphone', type: 'phone' },
  'cellphones': { icon: 'Smartphone', type: 'phone' },
  'smartphones': { icon: 'Smartphone', type: 'phone' },
  'iphones': { icon: 'Smartphone', type: 'phone' },
  'samsung': { icon: 'Smartphone', type: 'phone' },
  'laptops': { icon: 'Laptop', type: 'laptop' },
  'notebooks': { icon: 'Laptop', type: 'laptop' },
  'macbooks': { icon: 'Laptop', type: 'laptop' },
  'computers': { icon: 'Monitor', type: 'laptop' },
  'smartwatches': { icon: 'Watch', type: 'smartwatch' },
  'watches': { icon: 'Watch', type: 'smartwatch' },
  'wearables': { icon: 'Watch', type: 'smartwatch' },
  'headphones': { icon: 'Headphones', type: 'accessory' },
  'earbuds': { icon: 'Headphones', type: 'accessory' },
  'earphones': { icon: 'Headphones', type: 'accessory' },
  'airpods': { icon: 'Headphones', type: 'accessory' },
  'audio': { icon: 'Speaker', type: 'accessory' },
  'speakers': { icon: 'Speaker', type: 'accessory' },
  'accessories': { icon: 'Cable', type: 'accessory' },
  'chargers': { icon: 'Cable', type: 'accessory' },
  'cables': { icon: 'Cable', type: 'accessory' },
  'cases': { icon: 'Smartphone', type: 'accessory' },
  'tablets': { icon: 'Tablet', type: 'laptop' },
  'ipads': { icon: 'Tablet', type: 'laptop' },
  'cameras': { icon: 'Camera', type: 'accessory' },
  'tvs': { icon: 'Tv', type: 'other' },
  'televisions': { icon: 'Tv', type: 'other' },
  'monitors': { icon: 'Monitor', type: 'other' },
  'gaming': { icon: 'Gamepad2', type: 'other' },
  'consoles': { icon: 'Gamepad2', type: 'other' },
};

function inferCategoryMeta(name: string): { icon: string; type: string } {
  const lower = name.toLowerCase().trim();
  for (const [key, val] of Object.entries(categoryNameMap)) {
    if (lower.includes(key) || key.includes(lower)) return val;
  }
  return { icon: 'Package', type: 'other' };
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('categories');
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    api.auth.check().then((data: { authenticated: boolean }) => {
      if (!data.authenticated) router.push('/admin');
      else setAuthenticated(true);
      setChecking(false);
    }).catch(() => { router.push('/admin'); setChecking(false); });
  }, [router]);

  const handleLogout = async () => {
    await api.auth.logout();
    router.push('/admin');
  };

  if (checking || !authenticated) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full" /></div>;

  const tabs: { key: Tab; label: string; icon: typeof Tag }[] = [
    { key: 'categories', label: 'Categories', icon: Tag },
    { key: 'products', label: 'Products', icon: Package },
    { key: 'top-picks', label: "Top Picks", icon: Star },
    { key: 'deals', label: 'Deals', icon: Percent },
    { key: 'orders', label: 'Online Purchases', icon: ShoppingBag },
    { key: 'delivery', label: 'Delivery Fees', icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-primary shadow-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo" className="h-8 rounded" />
            <span className="font-display text-lg font-bold text-primary-foreground" data-testid="text-admin-header">Admin Dashboard</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-accent transition-colors" data-testid="button-logout">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key ? 'gradient-accent text-secondary-foreground' : 'bg-card border border-border text-foreground hover:bg-muted'
              }`}
              data-testid={`button-tab-${tab.key}`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'categories' && <CategoriesPanel />}
        {activeTab === 'products' && <ProductsPanel />}
        {activeTab === 'top-picks' && <TopPicksPanel />}
        {activeTab === 'deals' && <DealsPanel />}
        {activeTab === 'orders' && <OrdersPanel />}
        {activeTab === 'delivery' && <DeliverySettingsPanel />}
      </div>
    </div>
  );
};

function CategoriesPanel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState('');

  const load = () => api.categories.list().then(setCategories);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const meta = inferCategoryMeta(name);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('icon', meta.icon);
    formData.append('category_type', meta.type);
    if (editId) await api.categories.update(editId, formData);
    else await api.categories.create(formData);
    setShowForm(false); setName(''); setEditId(null);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    await api.categories.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-foreground" data-testid="text-categories-panel">Categories</h2>
        <button onClick={() => { setShowForm(true); setEditId(null); setName(''); }} className="flex items-center gap-2 gradient-accent px-4 py-2 rounded-lg text-sm font-medium text-secondary-foreground" data-testid="button-add-category">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-card border border-border p-4 mb-4 space-y-3" data-testid="form-category">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{editId ? 'Edit' : 'Add'} Category</h3>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></button>
          </div>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name (e.g. Phones, Laptops, Smartwatches)" required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="input-category-name" />
          {name && (
            <p className="text-xs text-muted-foreground">Auto-detected: {inferCategoryMeta(name).icon} icon · {inferCategoryMeta(name).type} type</p>
          )}
          <button type="submit" className="gradient-accent px-4 py-2 rounded-lg text-sm font-medium text-secondary-foreground" data-testid="button-save-category">Save</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-xl bg-card border border-border p-4 shadow-product flex items-center justify-between" data-testid={`card-category-${cat.id}`}>
            <div>
              <h3 className="font-semibold text-foreground">{cat.name}</h3>
              <p className="text-xs text-muted-foreground">{cat.product_count} products · {cat.icon} · {cat.category_type}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditId(cat.id); setName(cat.name); setShowForm(true); }} className="p-1.5 rounded-lg hover:bg-muted" data-testid={`button-edit-category-${cat.id}`}><Edit className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" data-testid={`button-delete-category-${cat.id}`}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', description: '', badge: '', stock: '0',
    condition: 'new', warranty: '', brand: '',
  });
  const [keyFeatures, setKeyFeatures] = useState<string[]>(['']);
  const [specs, setSpecs] = useState<Record<string, string>>({});
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [selectedCategoryType, setSelectedCategoryType] = useState('other');

  const load = () => {
    api.products.list().then((data: { results?: Product[] }) => setProducts(Array.isArray(data) ? data : data.results || []));
    api.categories.list().then(setCategories);
  };
  useEffect(() => { load(); }, []);

  const getCategoryType = (categoryId: string) => {
    const cat = categories.find(c => c.id === parseInt(categoryId));
    return cat?.category_type || 'other';
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({ ...prev, category: categoryId }));
    setSelectedCategoryType(getCategoryType(categoryId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', formData.name);
    fd.append('category', formData.category);
    fd.append('price', formData.price);
    fd.append('description', formData.description);
    fd.append('badge', formData.badge);
    fd.append('stock', formData.stock);
    fd.append('condition', formData.condition);
    fd.append('warranty', formData.warranty);
    fd.append('brand', formData.brand);

    const filteredFeatures = keyFeatures.filter(f => f.trim());
    fd.append('key_features', JSON.stringify(filteredFeatures));

    const filteredSpecs: Record<string, string> = {};
    for (const [k, v] of Object.entries(specs)) {
      if (v && v.trim()) filteredSpecs[k] = v.trim();
    }
    fd.append('specifications', JSON.stringify(filteredSpecs));

    if (mainImage) fd.append('image', mainImage);
    for (const img of additionalImages) {
      fd.append('additional_images', img);
    }

    if (editId) await api.products.update(editId, fd);
    else await api.products.create(fd);

    resetForm();
    load();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setMainImage(null);
    setAdditionalImages([]);
    setExistingImages([]);
    setFormData({ name: '', category: '', price: '', description: '', badge: '', stock: '0', condition: 'new', warranty: '', brand: '' });
    setKeyFeatures(['']);
    setSpecs({});
    setSelectedCategoryType('other');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return;
    await api.products.delete(id);
    load();
  };

  const handleDeleteImage = async (imageId: number) => {
    await api.products.deleteImage(imageId);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const startEdit = (p: Product) => {
    setEditId(p.id);
    setFormData({
      name: p.name, category: String(p.category), price: p.price,
      description: p.description, badge: p.badge, stock: String(p.stock),
      condition: p.condition || 'new', warranty: p.warranty || '', brand: p.brand || '',
    });
    setKeyFeatures(p.key_features && p.key_features.length > 0 ? [...p.key_features, ''] : ['']);
    setSpecs(p.specifications || {});
    setExistingImages(p.images || []);
    setSelectedCategoryType(p.category_type || getCategoryType(String(p.category)));
    setShowForm(true);
  };

  const addFeature = () => setKeyFeatures(prev => [...prev, '']);
  const updateFeature = (idx: number, val: string) => {
    setKeyFeatures(prev => prev.map((f, i) => i === idx ? val : f));
  };
  const removeFeature = (idx: number) => {
    setKeyFeatures(prev => prev.filter((_, i) => i !== idx));
  };

  const specSections = getSpecSections(selectedCategoryType);
  const totalImages = existingImages.length + additionalImages.length + (mainImage ? 1 : 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-foreground" data-testid="text-products-panel">Products</h2>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 gradient-accent px-4 py-2 rounded-lg text-sm font-medium text-secondary-foreground" data-testid="button-add-item">
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-card border border-border p-4 mb-4 space-y-4" data-testid="form-product">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{editId ? 'Edit' : 'Add'} Product</h3>
            <button type="button" onClick={resetForm}><X className="h-5 w-5" /></button>
          </div>

          <div className="space-y-4">
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider">Basic Information</h4>
              <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Product name" required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="input-product-name" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select value={formData.category} onChange={(e) => handleCategoryChange(e.target.value)} required className="rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="select-product-category">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.category_type})</option>)}
                </select>
                <input value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="Brand (e.g. Samsung)" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="input-product-brand" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price ($)" required className="rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="input-product-price" />
                <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="Stock qty" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="input-product-stock" />
                <select value={formData.condition} onChange={(e) => setFormData({ ...formData, condition: e.target.value })} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="select-product-condition">
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
                <input value={formData.warranty} onChange={(e) => setFormData({ ...formData, warranty: e.target.value })} placeholder="Warranty (e.g. 12 Months)" className="rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="input-product-warranty" />
              </div>
              <input value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} placeholder="Badge (e.g. NEW, HOT, SALE)" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="input-product-badge" />
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Full product description (About This Item)" rows={4} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="input-product-description" />
            </div>

            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider">Key Features (Bullet Points)</h4>
                <button type="button" onClick={addFeature} className="text-xs text-accent hover:underline" data-testid="button-add-feature">+ Add Feature</button>
              </div>
              {keyFeatures.map((feature, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-muted-foreground mt-2 text-sm">•</span>
                  <input
                    value={feature}
                    onChange={(e) => updateFeature(idx, e.target.value)}
                    placeholder={`Feature ${idx + 1} (e.g. Screen 6.7" FHD)`}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                    data-testid={`input-feature-${idx}`}
                  />
                  {keyFeatures.length > 1 && (
                    <button type="button" onClick={() => removeFeature(idx)} className="text-destructive hover:text-destructive/80 p-2"><X className="h-3 w-3" /></button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider flex items-center gap-2">
                <Upload className="h-4 w-4" /> Images ({totalImages}/8 max)
              </h4>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Main Image</label>
                <input type="file" accept="image/*" onChange={(e) => setMainImage(e.target.files?.[0] || null)} className="w-full text-sm" data-testid="input-product-image" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">Additional Images (up to {Math.max(0, 8 - existingImages.length - (mainImage ? 1 : 0))} more)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const maxAllowed = 8 - existingImages.length - (mainImage ? 1 : 0);
                    setAdditionalImages(files.slice(0, Math.max(0, maxAllowed)));
                  }}
                  className="w-full text-sm"
                  data-testid="input-additional-images"
                />
              </div>
              {existingImages.length > 0 && (
                <div>
                  <label className="block text-xs text-muted-foreground mb-2">Current Images</label>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={getMediaUrl(img.image)}
                          alt="Product"
                          className="h-16 w-16 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-delete-image-${img.id}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {additionalImages.length > 0 && (
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">New images to upload: {additionalImages.length}</label>
                  <div className="flex flex-wrap gap-1">
                    {additionalImages.map((f, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded">{f.name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {formData.category && (
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-foreground uppercase tracking-wider px-1">
                  Specifications ({selectedCategoryType.charAt(0).toUpperCase() + selectedCategoryType.slice(1)})
                </h4>
                {specSections.map((section) => (
                  <div key={section.title} className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <h5 className="font-medium text-sm text-accent">{section.title}</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {section.fields.map((field) => (
                        <div key={field.key}>
                          <label className="block text-xs text-muted-foreground mb-1">{field.label}</label>
                          {field.type === 'select' ? (
                            <select
                              value={specs[field.key] || ''}
                              onChange={(e) => setSpecs(prev => ({ ...prev, [field.key]: e.target.value }))}
                              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                              data-testid={`select-spec-${field.key}`}
                            >
                              <option value="">Select...</option>
                              {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          ) : (
                            <input
                              value={specs[field.key] || ''}
                              onChange={(e) => setSpecs(prev => ({ ...prev, [field.key]: e.target.value }))}
                              placeholder={field.placeholder}
                              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                              data-testid={`input-spec-${field.key}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="gradient-accent px-6 py-2.5 rounded-lg text-sm font-medium text-secondary-foreground" data-testid="button-save-product">
            {editId ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {products.map((p) => (
          <div key={p.id} className="rounded-xl bg-card border border-border p-4 shadow-product flex items-center gap-4" data-testid={`card-admin-product-${p.id}`}>
            {p.image && <img src={getMediaUrl(p.image)} alt={p.name} className="h-16 w-16 object-contain rounded-lg bg-muted" />}
            {!p.image && <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center"><ImageIcon className="h-6 w-6 text-muted-foreground" /></div>}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">{p.name}</h3>
              <p className="text-xs text-muted-foreground">{p.category_name} · {p.brand || 'No brand'} · SKU: {p.sku} · Stock: {p.stock}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-bold text-accent">${p.deal_price || p.price}</span>
                {p.deal_price && <span className="text-xs text-muted-foreground line-through">${p.price}</span>}
                {p.images && p.images.length > 0 && <span className="text-xs text-muted-foreground">· {p.images.length + (p.image ? 1 : 0)} images</span>}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(p)} className="p-1.5 rounded-lg hover:bg-muted" data-testid={`button-edit-product-${p.id}`}><Edit className="h-4 w-4" /></button>
              <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" data-testid={`button-delete-product-${p.id}`}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {products.length === 0 && <p className="text-center text-muted-foreground py-8">No products yet. Add your first product above.</p>}
      </div>
    </div>
  );
}

function TopPicksPanel() {
  const [topPicks, setTopPicks] = useState<TopPick[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [order, setOrder] = useState('0');

  const load = () => {
    api.topPicks.list().then(setTopPicks);
    api.products.list().then((data: Product[] | { results: Product[] }) => setProducts(Array.isArray(data) ? data : data.results || []));
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.topPicks.create({ product_id: parseInt(selectedProduct), order: parseInt(order), active: true });
    setShowForm(false); setSelectedProduct(''); setOrder('0');
    load();
  };

  const handleRemove = async (id: number) => {
    await api.topPicks.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-foreground" data-testid="text-top-picks-panel">This Month's Top Picks</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 gradient-accent px-4 py-2 rounded-lg text-sm font-medium text-secondary-foreground" data-testid="button-add-top-pick">
          <Plus className="h-4 w-4" /> Add Top Pick
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="rounded-xl bg-card border border-border p-4 mb-4 space-y-3" data-testid="form-top-pick">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Add Top Pick</h3>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></button>
          </div>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="select-top-pick-product">
            <option value="">Select product</option>
            {products.filter((p) => !topPicks.some((tp) => tp.product.id === p.id)).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} placeholder="Display order" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="input-top-pick-order" />
          <button type="submit" className="gradient-accent px-4 py-2 rounded-lg text-sm font-medium text-secondary-foreground" data-testid="button-save-top-pick">Add</button>
        </form>
      )}

      <div className="space-y-3">
        {topPicks.map((tp) => (
          <div key={tp.id} className="rounded-xl bg-card border border-border p-4 shadow-product flex items-center justify-between" data-testid={`card-top-pick-${tp.id}`}>
            <div>
              <h3 className="font-semibold text-foreground">#{tp.order} — {tp.product.name}</h3>
              <p className="text-xs text-muted-foreground">${tp.product.deal_price || tp.product.price}</p>
            </div>
            <button onClick={() => handleRemove(tp.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" data-testid={`button-remove-top-pick-${tp.id}`}><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        {topPicks.length === 0 && <p className="text-center text-muted-foreground py-8">No top picks set. Add products to feature on the homepage.</p>}
      </div>
    </div>
  );
}

function DealsPanel() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [dealPrice, setDealPrice] = useState('');
  const [savePercent, setSavePercent] = useState('');
  const [endDate, setEndDate] = useState('');

  const load = () => {
    api.deals.list().then(setDeals);
    api.products.list().then((data: Product[] | { results: Product[] }) => setProducts(Array.isArray(data) ? data : data.results || []));
  };
  useEffect(() => { load(); }, []);

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
    const product = products.find((p) => p.id === parseInt(productId));
    if (product && dealPrice) {
      const orig = parseFloat(product.price);
      const deal = parseFloat(dealPrice);
      if (orig > 0 && deal > 0) setSavePercent(((1 - deal / orig) * 100).toFixed(1));
    }
  };

  const handleDealPriceChange = (val: string) => {
    setDealPrice(val);
    const product = products.find((p) => p.id === parseInt(selectedProduct));
    if (product && val) {
      const orig = parseFloat(product.price);
      const deal = parseFloat(val);
      if (orig > 0 && deal > 0) setSavePercent(((1 - deal / orig) * 100).toFixed(1));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const dealData: Record<string, unknown> = { product: parseInt(selectedProduct), deal_price: dealPrice, save_percentage: savePercent, active: true };
    if (endDate) dealData.end_date = new Date(endDate).toISOString();
    await api.deals.create(dealData);
    setShowForm(false); setSelectedProduct(''); setDealPrice(''); setSavePercent(''); setEndDate('');
    load();
  };

  const toggleDeal = async (deal: Deal) => {
    await api.deals.update(deal.id, { active: !deal.active });
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this deal?')) return;
    await api.deals.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-foreground" data-testid="text-deals-panel">Deals</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 gradient-accent px-4 py-2 rounded-lg text-sm font-medium text-secondary-foreground" data-testid="button-add-deal">
          <Plus className="h-4 w-4" /> Add Deal
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="rounded-xl bg-card border border-border p-4 mb-4 space-y-3" data-testid="form-deal">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Add Deal</h3>
            <button type="button" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></button>
          </div>
          <select value={selectedProduct} onChange={(e) => handleProductSelect(e.target.value)} required className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="select-deal-product">
            <option value="">Select product</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name} — ${p.price}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" step="0.01" value={dealPrice} onChange={(e) => handleDealPriceChange(e.target.value)} placeholder="Deal price" required className="rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="input-deal-price" />
            <input type="number" step="0.1" value={savePercent} onChange={(e) => setSavePercent(e.target.value)} placeholder="Save %" required className="rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="input-deal-percent" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Deal end date (optional — controls countdown timer)</label>
            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="input-deal-end-date" />
          </div>
          <button type="submit" className="gradient-accent px-4 py-2 rounded-lg text-sm font-medium text-secondary-foreground" data-testid="button-save-deal">Save Deal</button>
        </form>
      )}

      <div className="space-y-3">
        {deals.map((d) => (
          <div key={d.id} className="rounded-xl bg-card border border-border p-4 shadow-product flex items-center justify-between" data-testid={`card-deal-${d.id}`}>
            <div>
              <h3 className="font-semibold text-foreground">{d.product_name}</h3>
              <p className="text-xs text-muted-foreground">Deal: ${d.deal_price} · Save {d.save_percentage}%</p>
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={() => toggleDeal(d)} className={`px-3 py-1 rounded-full text-xs font-medium ${d.active ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'}`} data-testid={`button-toggle-deal-${d.id}`}>
                {d.active ? 'Active' : 'Inactive'}
              </button>
              <button onClick={() => handleDelete(d.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive" data-testid={`button-delete-deal-${d.id}`}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {deals.length === 0 && <p className="text-center text-muted-foreground py-8">No deals yet. Create deals to offer discounts on products.</p>}
      </div>
    </div>
  );
}

function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const load = () => {
    api.orders.list({
      status: statusFilter || undefined,
      fulfillment_type: fulfillmentFilter || undefined,
      search: searchQuery || undefined,
    }).then((data: Order[] | { results: Order[] }) => setOrders(Array.isArray(data) ? data : data.results || []));
  };
  useEffect(() => { load(); }, [statusFilter, fulfillmentFilter, searchQuery]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    await api.orders.updateStatus(orderId, newStatus);
    load();
  };

  const statusColors: Record<string, string> = {
    awaiting_payment: 'bg-orange-500/20 text-orange-700',
    paid: 'bg-emerald-500/20 text-emerald-700',
    processing: 'bg-blue-500/20 text-blue-700',
    out_for_delivery: 'bg-purple-500/20 text-purple-700',
    delivered: 'bg-green-500/20 text-green-700',
    collected: 'bg-green-500/20 text-green-700',
    cancelled: 'bg-red-500/20 text-red-700',
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-4" data-testid="text-orders-panel">Online Purchases</h2>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by order # or name..."
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm flex-1 min-w-[200px]"
          data-testid="input-order-search"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="select-order-status">
          <option value="">All Statuses</option>
          <option value="awaiting_payment">Awaiting Payment</option>
          <option value="paid">Paid</option>
          <option value="processing">Processing</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="collected">Collected</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={fulfillmentFilter} onChange={(e) => setFulfillmentFilter(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-2 text-sm" data-testid="select-order-fulfillment">
          <option value="">All Types</option>
          <option value="delivery">Delivery</option>
          <option value="collection">Collection</option>
        </select>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl bg-card border border-border shadow-product overflow-hidden" data-testid={`card-order-${order.id}`}>
            <div className="p-4 flex items-center justify-between cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-foreground">{order.order_number}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || 'bg-muted'}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    {order.fulfillment_type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {order.customer_name} · ${order.total} · {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
            </div>

            {expandedOrder === order.id && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Email:</span> {order.customer_email}</div>
                  <div><span className="text-muted-foreground">Phone:</span> {order.customer_phone}</div>
                  {order.delivery_address && (
                    <div className="col-span-2 space-y-1">
                      <div><span className="text-muted-foreground">Address:</span> {order.delivery_address}</div>
                      {order.delivery_lat && order.delivery_lng && (
                        <a
                          href={`https://www.google.com/maps?q=${order.delivery_lat},${order.delivery_lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                        >
                          <MapPin className="h-3 w-3" /> View on Google Maps
                        </a>
                      )}
                      {parseFloat(order.delivery_fee) > 0 && (
                        <div><span className="text-muted-foreground">Delivery Fee:</span> <span className="font-medium">${order.delivery_fee}</span></div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Items:</h4>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                      <span>{item.quantity}x {item.product_name}</span>
                      <span className="font-medium">${item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <span className="text-sm text-muted-foreground mr-2">Update status:</span>
                  {order.fulfillment_type === 'delivery' ? (
                    <>
                      <button onClick={() => handleStatusUpdate(order.id, 'processing')} className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-700 hover:bg-blue-500/30" data-testid={`button-status-processing-${order.id}`}>Processing</button>
                      <button onClick={() => handleStatusUpdate(order.id, 'out_for_delivery')} className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-700 hover:bg-purple-500/30" data-testid={`button-status-out-${order.id}`}>Out for Delivery</button>
                      <button onClick={() => handleStatusUpdate(order.id, 'delivered')} className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-700 hover:bg-green-500/30" data-testid={`button-status-delivered-${order.id}`}>Delivered</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleStatusUpdate(order.id, 'processing')} className="px-3 py-1 rounded-full text-xs bg-blue-500/20 text-blue-700 hover:bg-blue-500/30" data-testid={`button-status-processing-${order.id}`}>Processing</button>
                      <button onClick={() => handleStatusUpdate(order.id, 'collected')} className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-700 hover:bg-green-500/30" data-testid={`button-status-collected-${order.id}`}>Collected</button>
                    </>
                  )}
                  <button onClick={() => handleStatusUpdate(order.id, 'cancelled')} className="px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-700 hover:bg-red-500/30" data-testid={`button-status-cancelled-${order.id}`}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && <p className="text-center text-muted-foreground py-8">No orders yet.</p>}
      </div>
    </div>
  );
}

function DeliverySettingsPanel() {
  const [harareFee, setHarareFee] = useState('');
  const [outsideHarareFee, setOutsideHarareFee] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.deliverySettings.get().then((data: { harare_fee: string; outside_harare_fee: string }) => {
      setHarareFee(data.harare_fee);
      setOutsideHarareFee(data.outside_harare_fee);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.deliverySettings.update({
        harare_fee: harareFee,
        outside_harare_fee: outsideHarareFee,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Failed to save delivery settings');
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-4" data-testid="text-delivery-panel">Delivery Fee Settings</h2>
      <p className="text-sm text-muted-foreground mb-6">Set delivery fees for orders within Harare and outside Harare. These fees will be shown to customers during checkout when they choose delivery.</p>

      <div className="max-w-md space-y-6">
        <div className="rounded-xl bg-card border border-border p-6 shadow-product space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <MapPin className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Harare Delivery</h3>
              <p className="text-xs text-muted-foreground">Within ~30km of Harare city center</p>
            </div>
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              step="0.01"
              min="0"
              value={harareFee}
              onChange={(e) => setHarareFee(e.target.value)}
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm"
              placeholder="5.00"
              data-testid="input-harare-fee"
            />
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border p-6 shadow-product space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Truck className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Outside Harare</h3>
              <p className="text-xs text-muted-foreground">All other locations in Zimbabwe</p>
            </div>
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              step="0.01"
              min="0"
              value={outsideHarareFee}
              onChange={(e) => setOutsideHarareFee(e.target.value)}
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2.5 text-sm"
              placeholder="15.00"
              data-testid="input-outside-harare-fee"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full gradient-accent py-2.5 rounded-lg font-semibold text-secondary-foreground disabled:opacity-50 flex items-center justify-center gap-2"
          data-testid="button-save-delivery-settings"
        >
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Delivery Fees'}
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
