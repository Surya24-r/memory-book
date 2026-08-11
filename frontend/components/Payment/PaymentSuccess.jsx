"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { fetchWithAuth } from "@/components/lib/fetchWithAuth";

function maskPhone(phone) {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "").slice(-10);
  if (digits.length < 10) return phone;
  return `+91 ${digits.slice(0, 2)}••• ••${digits.slice(-3)}`;
}

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`);
        if (res.ok) setOrder(await res.json());
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-[900px] mx-auto px-8 py-24 text-center">
        <div className="w-[96px] h-[96px] rounded-full bg-[#F4B323] flex items-center justify-center mx-auto">
          <Check size={44} strokeWidth={3} className="text-[#111111]" />
        </div>

        <p className="mt-8 text-[13px] font-semibold tracking-[3px] text-[#F4B323] uppercase">Thank You</p>
        <h1 className="mt-3 text-[44px] leading-[52px] font-serif text-[#111111]">Your book is confirmed! 🎉</h1>
        <p className="mt-4 text-[16px] text-[#666666]">
          Your MemoryBook is being crafted with care. We&apos;ll ship it to you in{" "}
          <span className="font-semibold text-[#333333]">5–7 business days</span>.
        </p>

        <div className="mt-8 inline-flex flex-col items-center bg-[#FAF9F7] rounded-[16px] px-10 py-4">
          <span className="text-[12px] tracking-[2px] text-[#999999] uppercase">Order Number</span>
          <span className="mt-1 text-[20px] font-bold text-[#111111]">
            {isLoading ? "Loading..." : order?.order_number || "—"}
          </span>
        </div>

        {order?.address_phone && (
          <div className="mt-6 max-w-[600px] mx-auto bg-[#EAF7EE] rounded-[14px] px-5 py-3 text-[14px] text-[#1E7B3B] flex items-center justify-center gap-2">
            <span>✅</span>
            <span>Order details sent to <strong>{maskPhone(order.address_phone)}</strong> — we&apos;ll update you at every step.</span>
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={() => router.push("/orders")} className="px-7 h-[48px] rounded-full bg-[#111111] text-white font-medium hover:bg-black transition">
            View my orders
          </button>
          <button onClick={() => router.push("/")} className="px-7 h-[48px] rounded-full border border-[#E5E5E5] text-[#111111] font-medium hover:bg-[#FAF9F7] transition">
            Continue shopping
          </button>
        </div>
      </div>
    </main>
  );
}