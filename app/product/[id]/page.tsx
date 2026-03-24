import ProductPage from "@/views/ProductPage";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/api/products/`);
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const products = await res.json();
    const results = Array.isArray(products) ? products : products.results || [];
    return results.map((p: { id: number }) => ({ id: String(p.id) }));
  } catch (e) {
    console.warn('Could not fetch products for static generation:', e);
    // Fallback: generate pages for IDs 1-200 so routes exist even if API is unreachable
    return Array.from({ length: 200 }, (_, i) => ({ id: String(i + 1) }));
  }
}

export default function Product() {
  return <ProductPage />;
}
