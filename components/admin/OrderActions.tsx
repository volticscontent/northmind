"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/actions";

const STATUS_OPTIONS = ["PENDENTE", "PAGO", "ENVIADO", "ENTREGUE"];

export function OrderActions({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Error updating order status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select 
      value={currentStatus}
      onChange={handleStatusChange}
      disabled={isUpdating}
      className={`text-[9px] font-black uppercase tracking-widest bg-transparent border-b outline-none transition-all ${
        isUpdating ? "opacity-50 cursor-not-allowed border-white/10 text-white/20" : "border-white/30 text-white/60 hover:text-white hover:border-white focus:text-white"
      }`}
    >
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status} className="bg-black text-white">
          {status}
        </option>
      ))}
    </select>
  );
}
