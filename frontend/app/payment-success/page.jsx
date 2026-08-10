import { Suspense } from "react";
import PaymentSuccess from "@/components/Payment/PaymentSuccess";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccess />
    </Suspense>
  );
}