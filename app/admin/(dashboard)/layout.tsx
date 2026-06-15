import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebarNav } from "@/components/admin/AdminSidebarNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if ((session?.user as any)?.type !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans">
      <AdminSidebarNav />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
