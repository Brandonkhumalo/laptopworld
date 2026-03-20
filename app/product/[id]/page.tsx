import ProductPage from "@/views/ProductPage";

export function generateStaticParams() {
  return [{ id: "0" }];
}

export default function Product() {
  return <ProductPage />;
}
