import PaymentStatusPage from "@/views/PaymentStatusPage";

export function generateStaticParams() {
  return [{ orderNumber: "0" }];
}

export default function PaymentStatus() {
  return <PaymentStatusPage />;
}
