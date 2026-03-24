import CategoryPage from "@/views/CategoryPage";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/api/categories/`);
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const categories = await res.json();
    return categories.map((cat: { id: number }) => ({ id: String(cat.id) }));
  } catch (e) {
    console.warn('Could not fetch categories for static generation:', e);
    // Fallback: generate pages for IDs 1-50 so routes exist even if API is unreachable
    return Array.from({ length: 50 }, (_, i) => ({ id: String(i + 1) }));
  }
}

export default function Category() {
  return <CategoryPage />;
}
