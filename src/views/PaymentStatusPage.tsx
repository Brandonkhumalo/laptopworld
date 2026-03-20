"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface OrderData {
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: string;
  total: string;
  payment_confirmed: boolean;
  fulfillment_type: string;
  items: { id: number; product_name: string; quantity: number; price: string }[];
}

const PaymentStatusPage = () => {
  const params = useParams();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  useEffect(() => {
    const segments = window.location.pathname.replace(/\/+$/, '').split('/');
    const urlId = segments[segments.length - 1];
    if (urlId && urlId !== '0') {
      setOrderNumber(urlId);
    } else {
      setOrderNumber(params.orderNumber as string);
    }
  }, [params.orderNumber]);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (!orderNumber) return;

    const checkStatus = async () => {
      try {
        const data = await api.paymentStatus(orderNumber);
        setOrder(data);
        setLoading(false);

        if (data.payment_confirmed || data.status === 'cancelled') {
          setPolling(false);
        }
      } catch {
        setLoading(false);
        setPolling(false);
      }
    };

    checkStatus();

    const interval = setInterval(() => {
      if (polling) checkStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [orderNumber, polling]);

  const renderStatus = () => {
    if (loading) {
      return (
        <div className="text-center py-12">
          <Loader2 className="h-12 w-12 text-accent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking payment status...</p>
        </div>
      );
    }

    if (!order) {
      return (
        <div className="text-center py-12">
          <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-xl font-bold text-foreground mb-2" data-testid="text-order-not-found">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find this order.</p>
          <Link href="/" className="gradient-accent px-6 py-2.5 rounded-lg font-medium text-secondary-foreground inline-block" data-testid="link-go-home">Go Home</Link>
        </div>
      );
    }

    if (order.payment_confirmed) {
      return (
        <div className="text-center">
          <div className="rounded-full bg-success/20 p-4 w-fit mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2" data-testid="text-payment-success">Payment Successful!</h2>
          <p className="text-muted-foreground mb-1">Thank you, {order.customer_name}!</p>
          <p className="text-muted-foreground mb-6">
            Your order <strong className="text-accent" data-testid="text-order-number">{order.order_number}</strong> has been confirmed.
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            A confirmation email has been sent to <strong>{order.customer_email}</strong>.
          </p>

          <div className="rounded-xl bg-muted/50 border border-border p-4 mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                <span className="text-muted-foreground">{item.product_name} x{item.quantity}</span>
                <span className="font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-foreground mt-3 pt-2 border-t border-border">
              <span>Total Paid</span>
              <span className="text-accent" data-testid="text-total-paid">${parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            {order.fulfillment_type === 'delivery'
              ? "We will deliver your order to the address provided."
              : "Your order will be ready for collection at our store."}
          </p>

          <Link href="/" className="gradient-accent px-6 py-2.5 rounded-lg font-medium text-secondary-foreground inline-block" data-testid="link-continue-shopping">Continue Shopping</Link>
        </div>
      );
    }

    if (order.status === 'cancelled') {
      return (
        <div className="text-center">
          <div className="rounded-full bg-destructive/20 p-4 w-fit mx-auto mb-4">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2" data-testid="text-payment-cancelled">Payment Cancelled</h2>
          <p className="text-muted-foreground mb-6">Your payment was not completed.</p>
          <Link href="/cart" className="gradient-accent px-6 py-2.5 rounded-lg font-medium text-secondary-foreground inline-block" data-testid="link-try-again">Try Again</Link>
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className="rounded-full bg-warning/20 p-4 w-fit mx-auto mb-4">
          <Clock className="h-10 w-10 text-warning" />
        </div>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2" data-testid="text-awaiting-payment">Awaiting Payment</h2>
        <p className="text-muted-foreground mb-2">
          Order <strong className="text-accent">{order.order_number}</strong>
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          We're waiting for your payment to be confirmed. This page will update automatically.
        </p>
        <Loader2 className="h-6 w-6 text-accent animate-spin mx-auto mb-6" />
        <p className="text-xs text-muted-foreground">
          If you've already paid, please wait a moment while we confirm your payment.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="rounded-xl bg-card border border-border p-8 shadow-product max-w-lg mx-auto">
          {renderStatus()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentStatusPage;
