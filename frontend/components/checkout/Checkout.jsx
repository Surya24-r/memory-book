"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEditorStore } from "@/components/store/useEditorStore";
import { fetchWithAuth } from "@/components/lib/fetchWithAuth";
import PaymentMethodModal from "../Payment/PaymentMethodModal";

const PRICE_PER_PAGE = 150;

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const designId = searchParams.get("design_id");
  const quantity = Math.max(1, Number(searchParams.get("quantity")) || 1);

  const bookTitle = useEditorStore((s) => s.bookTitle);
  const bookSize = useEditorStore((s) => s.bookSize);
  const spreads = useEditorStore((s) => s.spreads);

  const totalPages = 2 + spreads.length * 2;
  const pricePerBook = totalPages * PRICE_PER_PAGE;
  const total = pricePerBook * quantity;

  const [addresses, setAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", area: "", pincode: "", landmark: "", houseStreet: "" });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  useEffect(() => {
    if (!designId) return;
    const fetchAddresses = async () => {
      try {
        const res = await fetchWithAuth(`http://localhost:8000/addresses/${designId}`);
        if (res.ok) {
          const data = await res.json();
          setAddresses(data);
          if (data.length > 0) setSelectedAddressId(data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, [designId]);

  const handleFormChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSaveAddress = async () => {
    if (!form.fullName || !form.phone || !form.pincode || !form.houseStreet) {
      alert("Please fill in name, phone, pincode and address.");
      return;
    }
    setIsSavingAddress(true);
    try {
      const res = await fetchWithAuth("http://localhost:8000/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          design_id: designId, full_name: form.fullName, phone: form.phone,
          area: form.area, pincode: form.pincode, landmark: form.landmark, house_street: form.houseStreet,
        }),
      });
      if (!res.ok) throw new Error("Failed to save address");
      const saved = await res.json();
      setAddresses((prev) => [saved, ...prev]);
      setSelectedAddressId(saved.id);
      setShowForm(false);
      setForm({ fullName: "", phone: "", area: "", pincode: "", landmark: "", houseStreet: "" });
    } catch (error) {
      console.error("Failed to save address:", error);
      alert("Could not save address. Please try again.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleOpenPayment = () => {
    if (!selectedAddressId) { alert("Please select or add a delivery address first."); return; }
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async (paymentMethod) => {
    setIsCreatingOrder(true);
    try {
      const orderRes = await fetchWithAuth("http://localhost:8000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design_id: designId, address_id: selectedAddressId, quantity, amount: total }),
      });
      if (!orderRes.ok) throw new Error("Failed to create order");
      const order = await orderRes.json();

      const payRes = await fetchWithAuth(`http://localhost:8000/orders/${order.id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_method: paymentMethod }),
      });
      if (!payRes.ok) throw new Error("Failed to confirm payment");

      router.push(`/payment-success?order_id=${order.id}`);
    } catch (error) {
      console.error("Payment flow failed:", error);
      alert("Something went wrong confirming your order. Please try again.");
      setShowPaymentModal(false);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <h1 className="text-[42px] font-serif text-[#111111]">Checkout</h1>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="bg-white border border-[#ECECEC] rounded-[20px] p-8">
            <h2 className="text-[20px] font-semibold text-[#111111]">Delivery address</h2>

            {isLoadingAddresses ? (
              <p className="mt-5 text-sm text-[#999999]">Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <p className="mt-5 text-sm text-[#999999]">No saved addresses yet — add one below.</p>
            ) : (
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => {
                  const isSelected = addr.id === selectedAddressId;
                  return (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`text-left rounded-[16px] border p-5 transition ${isSelected ? "border-[#F4B323] bg-[#FFF9EC]" : "border-[#E5E5E5] bg-white hover:border-[#D5D5D5]"}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-[#111111]">{addr.full_name}</span>
                        <span className={`mt-1 w-[16px] h-[16px] rounded-full border flex items-center justify-center ${isSelected ? "border-[#F4B323]" : "border-[#CCCCCC]"}`}>
                          {isSelected && <span className="w-[8px] h-[8px] rounded-full bg-[#F4B323]" />}
                        </span>
                      </div>
                      <div className="mt-2 text-[14px] leading-6 text-[#666666]">
                        <div>{addr.house_street}</div>
                        {addr.landmark && <div>{addr.landmark}</div>}
                        {addr.area && <div>{addr.area}</div>}
                        <div>Pincode - {addr.pincode}</div>
                      </div>
                      <div className="mt-2 text-[14px] font-medium text-[#333333]">{addr.phone}</div>
                    </button>
                  );
                })}
              </div>
            )}

            <button type="button" onClick={() => setShowForm((prev) => !prev)} className="mt-6 w-full h-[50px] rounded-full bg-[#111111] text-white font-medium hover:bg-black transition">
              + Add New Address
            </button>

            {showForm && (
              <div className="mt-8 pt-8 border-t border-[#ECECEC]">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[13px] font-medium text-[#333333]">Full Name</label>
                    <input value={form.fullName} onChange={handleFormChange("fullName")} placeholder="e.g. Sundar Raghavan" className="mt-2 w-full h-[46px] rounded-[10px] bg-[#F7F7F5] border border-transparent px-4 text-[14px] focus:outline-none focus:border-[#F4B323]" />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-[#333333]">Phone Number</label>
                    <input value={form.phone} onChange={handleFormChange("phone")} placeholder="+91 00000 00000" className="mt-2 w-full h-[46px] rounded-[10px] bg-[#F7F7F5] border border-transparent px-4 text-[14px] focus:outline-none focus:border-[#F4B323]" />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-[#333333]">Area / Locality</label>
                    <input value={form.area} onChange={handleFormChange("area")} placeholder="e.g. Swamimalai" className="mt-2 w-full h-[46px] rounded-[10px] bg-[#F7F7F5] border border-transparent px-4 text-[14px] focus:outline-none focus:border-[#F4B323]" />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-[#333333]">Pincode</label>
                    <input value={form.pincode} onChange={handleFormChange("pincode")} placeholder="612001" className="mt-2 w-full h-[46px] rounded-[10px] bg-[#F7F7F5] border border-transparent px-4 text-[14px] focus:outline-none focus:border-[#F4B323]" />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-[#333333]">Landmark (Optional)</label>
                    <input value={form.landmark} onChange={handleFormChange("landmark")} placeholder="e.g. Near Sarangapani Temple" className="mt-2 w-full h-[46px] rounded-[10px] bg-[#F7F7F5] border border-transparent px-4 text-[14px] focus:outline-none focus:border-[#F4B323]" />
                  </div>
                  <div>
                    <label className="text-[13px] font-medium text-[#333333]">House / Street / Apartment</label>
                    <input value={form.houseStreet} onChange={handleFormChange("houseStreet")} placeholder="Plot No, Building Name, Street" className="mt-2 w-full h-[46px] rounded-[10px] bg-[#F7F7F5] border border-transparent px-4 text-[14px] focus:outline-none focus:border-[#F4B323]" />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button type="button" disabled={isSavingAddress} onClick={handleSaveAddress} className="px-7 h-[46px] rounded-full bg-[#F4B323] text-[#111111] font-medium hover:bg-[#e0a31f] transition disabled:opacity-50">
                    {isSavingAddress ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div className="bg-white border border-[#ECECEC] rounded-[20px] p-7">
              <p className="text-[12px] tracking-[2px] uppercase font-semibold text-[#999999]">Order Summary</p>
              <h3 className="mt-2 text-[18px] font-semibold text-[#111111]">{bookTitle || "Untitled Book"}</h3>
              <p className="text-[14px] text-[#777777]">
                {bookSize?.title} · {totalPages} pages{quantity > 1 ? ` · Qty ${quantity}` : ""}
              </p>

              <div className="mt-5 pt-5 border-t border-[#ECECEC] space-y-2 text-[14px]">
                <div className="flex justify-between text-[#444444]">
                  <span>{totalPages} pages × ₹{PRICE_PER_PAGE}{quantity > 1 ? ` × ${quantity}` : ""}</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[#F4B323] font-medium">
                  <span>Delivery</span><span>FREE</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#ECECEC] flex justify-between items-center">
                <span className="text-[18px] font-semibold text-[#111111]">Total</span>
                <span className="text-[18px] font-semibold text-[#111111]">₹{total.toLocaleString("en-IN")}</span>
              </div>

              <button type="button" disabled={isCreatingOrder} onClick={handleOpenPayment} className="mt-6 w-full h-[52px] rounded-full bg-[#F4B323] text-[#111111] font-semibold hover:bg-[#e0a31f] transition disabled:opacity-50">
                Pay ₹{total.toLocaleString("en-IN")} securely
              </button>

              <p className="mt-3 text-center text-[12px] text-[#999999]">100% PREPAID · INSTANT CONFIRMATION · SSL SECURED</p>

              <button type="button" onClick={() => router.push(`/review?design_id=${designId}`)} className="mt-2 w-full text-center text-[13px] text-[#666666] hover:text-black">
                ← Back to review
              </button>
            </div>

            <div className="bg-[#FFF9EC] border border-[#F4E2B0] rounded-[20px] p-6">
              <p className="font-semibold text-[#111111]">Need help with checkout?</p>
              <p className="mt-1 text-[14px] text-[#666666]">Call our Kumbakonam studio at +91 435 240XXXX for assistance.</p>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <PaymentMethodModal amount={total} onClose={() => !isCreatingOrder && setShowPaymentModal(false)} onConfirm={handleConfirmPayment} />
      )}
    </section>
  );
}