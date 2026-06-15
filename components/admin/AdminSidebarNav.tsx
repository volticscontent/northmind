"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Layout, Settings, ChevronRight } from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package, exact: false },
  { href: "/admin/collections", label: "Collections", icon: Layout, exact: false },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart, exact: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: false },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col justify-between shrink-0">
      <div>
        <div className="mb-12 flex items-center gap-3">
          <div className="size-8 bg-white flex items-center justify-center rounded">
            <span className="text-black font-black text-xs">NM</span>
          </div>
          <h1 className="text-sm font-black uppercase tracking-widest text-white">
            Admin Panel
          </h1>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-xs font-bold uppercase tracking-widest ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={16} className={isActive ? "text-white" : "text-white/40"} />
                {label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1">
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
  );
}
