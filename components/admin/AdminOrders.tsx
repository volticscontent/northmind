"use client";

import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  ChevronDown, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  RefreshCw,
  Search,
  Filter,
  Eye
} from "lucide-react";
import { API_URL } from "@/lib/api";
import { getOrders, updateOrderStatus } from "@/lib/actions";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDENTE: { label: "Pendente", color: "text-amber-400", bg: "bg-amber-500/10", icon: Clock },
  PAGO: { label: "Pago", color: "text-emerald-400", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  ENVIADO: { label: "Enviado", color: "text-blue-400", bg: "bg-blue-500/10", icon: Truck },
  ENTREGUE: { label: "Entregue", color: "text-purple-400", bg: "bg-purple-500/10", icon: Package },
};

const STATUS_OPTIONS = ["PENDENTE", "PAGO", "ENVIADO", "ENTREGUE"];

interface Order {
  id: string;
  status: string;
  totalAmmount: number;
  produtosIds: string[];
  dataCompra: string;
  dataEntrega?: string;
  user?: { name: string; email: string; id: string };
}

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Failed to update", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === "ALL" || o.status === filter;
    const matchesSearch = search === "" || 
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
            Order Processing
          </h2>
          <p className="text-xs font-bold uppercase tracking-widest text-white/40">
            {orders.length} total orders · {statusCounts["PENDENTE"] || 0} awaiting action
          </p>
        </div>
        <button 
          onClick={fetchOrders} 
          className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
            filter === "ALL" 
            ? "bg-white text-black" 
            : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/5"
          }`}
        >
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map(status => {
          const config = STATUS_CONFIG[status];
          const count = statusCounts[status] || 0;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                filter === status 
                ? `${config.bg} ${config.color}` 
                : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
        <input
          type="text"
          placeholder="Search by customer name, email or order ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-black border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
        {loading ? (
          <div className="p-20 flex items-center justify-center">
            <RefreshCw size={24} className="animate-spin text-white/20" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-20 flex flex-col items-center text-center">
            <ShoppingBag size={40} className="text-white/10 mb-4" />
            <p className="text-sm text-white/30">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-white/20">Order</th>
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-white/20">Customer</th>
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-white/20">Date</th>
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-white/20">Items</th>
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-white/20">Status</th>
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-white/20 text-right">Total</th>
                  <th className="py-5 px-6 text-[10px] font-black uppercase tracking-widest text-white/20 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filteredOrders.map((order) => {
                  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG["PENDENTE"];
                  const StatusIcon = config.icon;
                  const isUpdating = updatingId === order.id;
                  const isExpanded = expandedId === order.id;
                  const orderDate = new Date(order.dataCompra);
                  
                  return (
                    <tr 
                      key={order.id} 
                      className={`group transition-colors ${isExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'}`}
                    >
                      <td className="py-5 px-6">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest font-mono">
                          #{order.id.slice(-8)}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-[10px] font-black text-white/40 uppercase">
                            {order.user?.name?.[0] || "?"}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-white mb-0.5">
                              {order.user?.name || "Guest"}
                            </span>
                            <span className="text-[10px] text-white/20">
                              {order.user?.email || "—"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-white/60">
                            {orderDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                          </span>
                          <span className="text-[9px] text-white/20">
                            {orderDate.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-[10px] font-bold text-white/40">
                          {order.produtosIds.length} item{order.produtosIds.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg}`}>
                            <StatusIcon size={12} className={config.color} />
                            <span className={`text-[9px] font-black uppercase tracking-widest ${config.color}`}>
                              {config.label}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <span className="text-sm font-black text-white">
                          £{order.totalAmmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Status Dropdown */}
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={e => handleStatusChange(order.id, e.target.value)}
                              disabled={isUpdating}
                              className={`appearance-none cursor-pointer bg-white/5 border border-white/10 rounded-lg px-3 py-2 pr-7 text-[9px] font-black uppercase tracking-widest outline-none transition-all ${
                                isUpdating 
                                ? "opacity-50 cursor-not-allowed text-white/20" 
                                : "text-white/60 hover:text-white hover:border-white/30 focus:border-accent/50"
                              }`}
                            >
                              {STATUS_OPTIONS.map(status => (
                                <option key={status} value={status} className="bg-black text-white">
                                  {STATUS_CONFIG[status].label}
                                </option>
                              ))}
                            </select>
                            <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
