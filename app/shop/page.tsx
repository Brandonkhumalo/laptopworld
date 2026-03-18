import { Suspense } from "react";
import ShopPage from "@/views/ShopPage";

export const metadata = {
  title: "Shop All Products | Laptop World",
  description: "Browse our full collection of laptops, cellphones, smartwatches & accessories at Laptop World Zimbabwe.",
};

export default function Shop() {
  return (
    <Suspense>
      <ShopPage />
    </Suspense>
  );
}
