import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  ShoppingBag,
  Package,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  User as UserIcon,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { ProfileCard } from "@/components/customer/ProfileCard";
import { OrderCard } from "@/components/customer/OrderCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  let user, productsDict;
  try {
    const res = await fetch(`${API_URL}/api/admin/customer/${session.user.email}`, { 
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${(session?.user as any)?.token}`
      }
    });
    
    if (!res.ok) {
        console.error(`Customer API failed with status: ${res.status}`);
        return (
          <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-6">
              <ShoppingBag size={48} className="mx-auto text-white/20" />
              <h1 className="text-2xl font-light">Account <span className="font-medium text-accent">Not Found</span></h1>
              <p className="text-sm text-white/40 leading-relaxed">
                We couldn't find a customer profile for <span className="text-white font-medium">{session.user.email}</span>. 
                This usually happens if you haven't placed an order yet using this account.
              </p>
              <div className="pt-4 flex flex-col gap-3">
                <Link href="/" className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent transition-colors">
                  Go to Store
                </Link>
                <Link href="/api/auth/signout" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white">
                  Sign Out
                </Link>
              </div>
            </div>
          </div>
        );
    }

    const data = await res.json();
    user = data.user;
    productsDict = data.productsDict;
  } catch (error) {
    console.error("Dashboard Load Error:", error);
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <Clock size={48} className="mx-auto text-rose-500/40" />
          <h1 className="text-2xl font-light">Connection <span className="font-medium">Error</span></h1>
          <p className="text-sm text-white/40">The backend server is not responding. Please make sure the backend is running.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-accent selection:text-black">
      {/* Top Navigation / Breadcrumbs */}
      <div className="border-b border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-white/30 mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={10} />
              <span className="text-accent">Member Area</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              Welcome, <span className="font-medium">{user.name?.split(" ")[0]}</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/api/auth/signout"
              className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white">Sign Out</span>
              <LogOut size={14} className="text-white/40 group-hover:text-accent" />
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Stats & Profile */}
          <div className="lg:col-span-1 space-y-8">
            <ProfileCard user={user as any} />

            {/* Quick Actions / Store Link */}
            <div className="relative group overflow-hidden rounded-3xl aspect-[4/3] flex items-end p-8 border border-white/10">
              <div className="absolute inset-0 bg-[url('/assets/products/jacket-1.png')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 w-full">
                <h4 className="text-xl font-light mb-4">Complete your Heritage collection.</h4>
                <Link href="/collections/jackets" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent group-hover:gap-4 transition-all">
                  Shop New Items <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Orders History */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="text-2xl font-light">Order <span className="font-medium">History</span></h2>
              <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-accent transition-colors">View All</Link>
            </div>

            {user.pedidos.length === 0 ? (
              <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-3xl p-20 flex flex-col items-center text-center">
                <div className="p-4 rounded-full bg-white/5 mb-6">
                  <ShoppingBag size={40} className="text-white/20" />
                </div>
                <h3 className="text-lg font-light text-white/60 mb-2">No orders yet</h3>
                <p className="text-sm text-white/30 max-w-[240px] mb-8 font-light">Your journey with North Mind starts with your first unique piece.</p>
                <Link href="/collections/jackets" className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-accent transition-colors">
                  Explore Collections
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {user.pedidos.map((pedido: any) => (
                  <OrderCard key={pedido.id} pedido={pedido as any} productsDict={productsDict} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ArrowRight({ className, size }: { className?: string, size?: number }) {
  return (
    <svg
      className={className}
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
