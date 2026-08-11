"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { fetchWithAuth } from "@/components/lib/fetchWithAuth";

const STATUS_OPTIONS = [
  { value: "paid", label: "PAID", color: "#6B7280" },
  { value: "printing", label: "PRINTING", color: "#F6BE24" },
  { value: "dispatched", label: "DISPATCHED", color: "#3B82F6" },
  { value: "delivered", label: "DELIVERED", color: "#22C55E" },
  { value: "failed", label: "FAILED", color: "#EF4444" },
];

// Retries a fetch a couple of times if it comes back 401. This exists
// specifically for the moment right after login: the session can take a
// beat to become fully readable everywhere, so the very first request or
// two off a fresh sign-in can 401 even though the session is valid a
// second later (this matches the observed "works after refresh" pattern).
async function fetchWithAuthRetry(url, options = {}, { retries = 3, delayMs = 700 } = {}) {
  let lastResponse = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetchWithAuth(url, options);
    if (res.status !== 401) return res;
    lastResponse = res;
    if (attempt < retries) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return lastResponse;
}

function StatusDropdown({ orderId, status, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const current = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      onStatusChange(orderId, newStatus);
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Could not update order status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select value={status} onChange={handleChange} disabled={isUpdating} style={{ backgroundColor: current.color }} className="text-white px-3 py-[3px] rounded-full text-[12px] font-semibold tracking-wide border-0 cursor-pointer disabled:opacity-60">
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value} style={{ color: "#111111", backgroundColor: "#ffffff" }}>{opt.label}</option>
      ))}
    </select>
  );
}

export default function Orders() {
  const router = useRouter();

  const [drafts, setDrafts] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(true);
  const [draftsError, setDraftsError] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await fetchWithAuthRetry(`${process.env.NEXT_PUBLIC_API_URL}/editor/drafts`);
        if (!res.ok) throw new Error("Failed to fetch drafts");
        setDrafts(await res.json());
      } catch (err) {
        console.error("Error fetching drafts:", err);
        setDraftsError(true);
      } finally {
        setLoadingDrafts(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetchWithAuthRetry(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        setOrders(await res.json());
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrdersError(true);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchDrafts();
    fetchOrders();
  }, []);

  const handleContinueDesigning = (designId) => router.push(`/editor?design_id=${designId}`);
  const handleStatusChange = (orderId, newStatus) => setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

  const handleDeleteOrder = async (orderId, title) => {
    const confirmed = window.confirm(`Delete the order for "${title}"? This can't be undone.`);
    if (!confirmed) return;
    setDeletingOrderId(orderId);
    try {
      const res = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete order");
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("Could not delete this order. Please try again.");
    } finally {
      setDeletingOrderId(null);
    }
  };

  const formatLastEdited = (dateString) => {
    if (!dateString) return "";
    const diffDays = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Last edited today";
    if (diffDays === 1) return "Last edited 1 day ago";
    return `Last edited ${diffDays} days ago`;
  };

  const formatOrderDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", { month: "short", day: "2-digit", year: "numeric" });
  };

  return (
    <section className="w-full bg-[#FAF9F7]">
      <div className="max-w-[1280px] mx-auto px-8 py-14">
        <h1 className="text-[48px] leading-[56px] font-medium text-[#111111]">My Orders</h1>
        <p className="mt-2 text-[18px] leading-7 text-[#666666]">Track your MemoryBooks from print to doorstep.</p>

        <div className="mt-16 flex items-center justify-between">
          <h2 className="text-[34px] leading-none text-[#111111]">Drafts</h2>
          <p className="text-[18px] text-[#444444]">{loadingDrafts ? "..." : `${drafts.length} Items`}</p>
        </div>

        <div className="mt-6 space-y-5">
          {loadingDrafts ? (
            <div className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-10 text-center text-[#666666]">Loading drafts...</div>
          ) : draftsError ? (
            <div className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-10 text-center text-[#666666]">Couldn't load your drafts. Please try again later.</div>
          ) : drafts.length === 0 ? (
            <div className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-10 text-center text-[#666666]">You don't have any drafts yet. Start creating your own book!</div>
          ) : (
            drafts.map((draft) => (
              <div key={draft.design_id} className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Image src={draft.thumbnail_url || "/images/booksorder.svg"} alt={draft.title} width={96} height={96} className="rounded-[18px] object-cover w-[96px] h-[96px]" />
                  <div>
                    <h3 className="text-[24px] leading-[32px] text-[#111111]">{draft.title}</h3>
                    <p className="mt-1 text-[16px] text-[#666666]">{draft.photo_count} photo{draft.photo_count === 1 ? "" : "s"} added</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[14px] text-[#666666]">{formatLastEdited(draft.updated_at)}</p>
                  <button onClick={() => handleContinueDesigning(draft.design_id)} className="mt-4 bg-[#F6BE24] px-8 py-3 rounded-full text-[14px] font-semibold hover:bg-[#e5ae1a] transition">
                    CONTINUE DESIGNING →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-20 flex items-center justify-between">
          <h2 className="text-[34px] leading-none text-[#111111]">Past Orders</h2>
          <p className="text-[18px] text-[#444444]">{loadingOrders ? "..." : `${orders.length} Items`}</p>
        </div>

        <div className="mt-6 space-y-5">
          {loadingOrders ? (
            <div className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-10 text-center text-[#666666]">Loading orders...</div>
          ) : ordersError ? (
            <div className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-10 text-center text-[#666666]">Couldn't load your orders. Please try again later.</div>
          ) : orders.length === 0 ? (
            <div className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-10 text-center text-[#666666]">No orders yet — once you check out a book, it'll show up here.</div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Image src={order.thumbnail_url || "/images/booksorder.svg"} alt={order.title} width={96} height={96} className="rounded-[18px] object-cover w-[96px] h-[96px]" />
                  <div>
                    <h3 className="text-[24px] leading-[32px] text-[#111111]">{order.title}</h3>
                    <p className="mt-1 text-[16px] text-[#666666]">{order.order_number} · {formatOrderDate(order.created_at)}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <StatusDropdown orderId={order.id} status={order.status} onStatusChange={handleStatusChange} />
                      <span className="text-[18px] font-semibold text-[#111111]">₹{order.amount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <button className="bg-black text-white px-7 py-2.5 rounded-full text-[14px] font-medium">Track</button>
                    <button className="mt-3 text-[14px] underline text-[#666666]">Invoice</button>
                  </div>
                  <button onClick={() => handleDeleteOrder(order.id, order.title)} disabled={deletingOrderId === order.id} title="Delete order" className="w-9 h-9 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#999999] hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition disabled:opacity-50">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}