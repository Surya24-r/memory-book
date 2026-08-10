"use client";

import { useState } from "react";
import { X } from "lucide-react";

const METHODS = [
  { id: "gpay", label: "Google Pay", hint: "UPI" },
  { id: "phonepe", label: "PhonePe", hint: "UPI" },
  { id: "paytm", label: "Paytm", hint: "UPI / Wallet" },
  { id: "card", label: "Credit / Debit Card", hint: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", hint: "All major banks" },
];

export default function PaymentMethodModal({ amount, onClose, onConfirm }) {
  const [selected, setSelected] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = async () => {
    if (!selected) return;
    setIsProcessing(true);
    // Simulated processing delay — replace with real gateway call later
    await new Promise((resolve) => setTimeout(resolve, 1400));
    onConfirm(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4">
      <div className="w-full sm:max-w-[420px] bg-white rounded-t-[24px] sm:rounded-[24px] p-6 pb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#111111]">Choose payment method</h2>
          <button onClick={onClose} className="text-[#999999] hover:text-black">
            <X size={20} />
          </button>
        </div>
        <p className="mt-1 text-[14px] text-[#777777]">
          Pay ₹{amount.toLocaleString("en-IN")} securely
        </p>

        <div className="mt-5 space-y-3">
          {METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              disabled={isProcessing}
              onClick={() => setSelected(m.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[14px] border text-left transition ${
                selected === m.id
                  ? "border-[#F4B323] bg-[#FFF9EC]"
                  : "border-[#E5E5E5] hover:border-[#D5D5D5]"
              }`}
            >
              <span>
                <span className="block text-[15px] font-medium text-[#111111]">{m.label}</span>
                <span className="block text-[12px] text-[#999999]">{m.hint}</span>
              </span>
              <span
                className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center ${
                  selected === m.id ? "border-[#F4B323]" : "border-[#CCCCCC]"
                }`}
              >
                {selected === m.id && <span className="w-[9px] h-[9px] rounded-full bg-[#F4B323]" />}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={!selected || isProcessing}
          onClick={handlePay}
          className="mt-6 w-full h-[52px] rounded-full bg-[#F4B323] text-[#111111] font-semibold hover:bg-[#e0a31f] transition disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : `Pay ₹${amount.toLocaleString("en-IN")}`}
        </button>
      </div>
    </div>
  );
}