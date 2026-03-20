import CategoryPage from "@/views/CategoryPage";

export function generateStaticParams() {
  return [{ id: "0" }];
}

export default function Category() {
  return <CategoryPage />;
}
