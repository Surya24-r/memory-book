import { Suspense } from "react";
import Checkout from "@/components/checkout/Checkout";

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <Checkout />
    </Suspense>
  );
}