import { getAdminStats } from "@/lib/actions";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ChevronRight,
  History
} from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Total Revenue", value: `£${stats.totalRevenue.toFixed(2)}`, icon: <DollarSign size={20} className="text-emerald-500" /> },
    { label: "Active Orders", value: stats.totalOrders.toString(), icon: <ShoppingBag size={20} className="text-blue-500" /> },
    { label: "Total Customers", value: stats.totalUsers.toString(), icon: <Users size={20} className="text-amber-500" /> },
    { label: "Avg. Ticket", value: `£${(stats.totalRevenue / (stats.totalOrders || 1)).toFixed(2)}`, icon: <TrendingUp size={20} className="text-indigo-500" /> },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">
          Dashboard
        </h2>
        <p className="text-xs font-bold uppercase tracking-widest text-white/40">
          Overview of your store's performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="p-6 bg-black border border-white/5 rounded-2xl shadow-2xl transition-all hover:border-white/10 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-1">
                {card.label}
              </p>
              <h3 className="text-2xl font-black text-white">
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="p-8 bg-black border border-white/5 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <History size={20} className="text-white" />
            </div>
            <div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">
                    Recent Orders
                </h3>
            </div>
          </div>
          <Link 
            href="/admin/orders" 
            className="flex items-center gap-2 group text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all"
          >
            Vier all orders
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="pb-5 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Customer</th>
                <th className="pb-5 px-4 text-[10px] font-black uppercase tracking-widest text-white/20">Status</th>
                <th className="pb-5 px-4 text-[10px] font-black uppercase tracking-widest text-white/20 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-white/[0.01]">
                  <td className="py-6 px-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-tight text-white mb-0.5">
                        {(order.user as any)?.name || "Anonumous"}
                      </span>
                      <span className="text-[10px] font-medium text-white/20">
                        {(order.user as any)?.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'PAGO' ? 'bg-emerald-500/10 text-emerald-400' : 
                        order.status === 'PENDENTE' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-white/10 text-white/40'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <span className="text-xs font-black text-white">
                      £{order.totalAmmount.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
