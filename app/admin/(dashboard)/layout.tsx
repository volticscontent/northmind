import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut,
  ChevronRight,
  Layout
} from "lucide-react";

import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Security check: Only Admins can enter
  if ((session?.user as any)?.type !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col justify-between">
        <div>
          <div className="mb-12 flex items-center gap-3">
             <div className="size-8 bg-white flex items-center justify-center rounded">
                <span className="text-black font-black text-xs">NM</span>
             </div>
             <h1 className="text-sm font-black uppercase tracking-widest text-white">
                Admin Panel
             </h1>
          </div>

          <nav className="space-y-2">
            <Link 
              href="/admin" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            <Link 
              href="/admin/products" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white"
            >
              <Package size={16} />
              Products
            </Link>
            <Link 
              href="/admin/collections" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white"
            >
              <Layout size={16} />
              Collections
            </Link>
            <Link 
              href="/admin/orders" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white"
            >
              <ShoppingCart size={16} />
              Orders
            </Link>
          </nav>
        </div>

        <div className="space-y-2">
            <Link 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest text-white/30 hover:text-white"
            >
              <ChevronRight size={16} />
              Back to Store
            </Link>
            <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
