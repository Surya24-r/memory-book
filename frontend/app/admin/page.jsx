"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchWithAuth } from "@/components/lib/fetchWithAuth";
import { useRequireAdmin } from "@/components/hooks/useRequireAdmin";

const STATUS_OPTIONS = [
  { value: "paid", label: "PAID", color: "#6B7280" },
  { value: "printing", label: "PRINTING", color: "#F6BE24" },
  { value: "dispatched", label: "DISPATCHED", color: "#3B82F6" },
  { value: "delivered", label: "DELIVERED", color: "#22C55E" },
  { value: "failed", label: "FAILED", color: "#EF4444" },
];

function StatusDropdown({ orderId, status, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const current = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setIsUpdating(true);
    try {
      const res = await fetchWithAuth(`http://localhost:8000/orders/${orderId}/status`, {
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

export default function AdminDashboard() {
  const { isLoading: authLoading } = useRequireAdmin();
  const router = useRouter();

  const [drafts, setDrafts] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(true);
  const [draftsError, setDraftsError] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    const fetchDrafts = async () => {
      try {
        const res = await fetchWithAuth("http://localhost:8000/admin/drafts");
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
        const res = await fetchWithAuth("http://localhost:8000/admin/orders");
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
  }, [authLoading]);

  const handleStatusChange = (orderId, newStatus) =>
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));

  const formatOrderDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-IN", { month: "short", day: "2-digit", year: "numeric" });
  };

  const formatLastEdited = (dateString) => {
    if (!dateString) return "";
    const diffDays = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Last edited today";
    if (diffDays === 1) return "Last edited 1 day ago";
    return `Last edited ${diffDays} days ago`;
  };

  if (authLoading) return null;

  return (
    <section className="w-full bg-[#FAF9F7]">
      <div className="max-w-[1280px] mx-auto px-8 py-14">
        <h1 className="text-[48px] leading-[56px] font-medium text-[#111111]">Studio Admin</h1>
        <p className="mt-2 text-[18px] leading-7 text-[#666666]">All drafts and orders across every customer.</p>

        <div className="mt-16 flex items-center justify-between">
          <h2 className="text-[34px] leading-none text-[#111111]">All Drafts</h2>
          <p className="text-[18px] text-[#444444]">{loadingDrafts ? "..." : `${drafts.length} Items`}</p>
        </div>

        <div className="mt-6 space-y-5">
          {loadingDrafts ? (
            <div className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-10 text-center text-[#666666]">Loading drafts...</div>
          ) : draftsError ? (
            <div className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-10 text-center text-[#666666]">Couldn't load drafts.</div>
          ) : drafts.length === 0 ? (
            <div className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-10 text-center text-[#666666]">No drafts yet across any customer.</div>
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
                <p className="text-[14px] text-[#666666]">{formatLastEdited(draft.updated_at)}</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-20 flex items-center justify-between">
          <h2 className="text-[34px] leading-none text-[#111111]">All Orders</h2>
          <p className="text-[18px] text-[#444444]">{loadingOrders ? "..." : `${orders.length} Items`}</p>
        </div>

        <div className="mt-6 space-y-5">
          {loadingOrders ? (
            <div className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-10 text-center text-[#666666]">Loading orders...</div>
          ) : ordersError ? (
            <div className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-10 text-center text-[#666666]">Couldn't load orders.</div>
          ) : orders.length === 0 ? (
            <div className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-10 text-center text-[#666666]">No orders yet across any customer.</div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border border-[#E5E5E5] rounded-[28px] bg-white px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Image src={order.thumbnail_url || "/images/booksorder.svg"} alt={order.title} width={96} height={96} className="rounded-[18px] object-cover w-[96px] h-[96px]" />
                  <div>
                    <h3 className="text-[24px] leading-[32px] text-[#111111]">{order.title}</h3>
                    <p className="mt-1 text-[16px] text-[#666666]">{order.order_number} · {formatOrderDate(order.created_at)}</p>
                    {order.customer_email && (
                      <p className="mt-1 text-[13px] text-[#999999]">{order.customer_email}</p>
                    )}
                    <div className="mt-3 flex items-center gap-3">
                      <StatusDropdown orderId={order.id} status={order.status} onStatusChange={handleStatusChange} />
                      <span className="text-[18px] font-semibold text-[#111111]">₹{order.amount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}