import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Laptop World | Zimbabwe's Premier Tech Store",
  description:
    "Shop genuine cellphones, laptops, smartwatches & accessories at Laptop World. Same-day delivery in Harare.",
  openGraph: {
    title: "Laptop World | Zimbabwe's Premier Tech Store",
    description:
      "Shop genuine cellphones, laptops, smartwatches & accessories. Same-day delivery in Harare.",
    type: "website",
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@LaptopWorld",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
