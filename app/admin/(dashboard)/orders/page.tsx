import { getOrders } from "@/lib/actions";
import AdminOrdersClient from "@/components/admin/AdminOrders";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <AdminOrdersClient initialOrders={orders} />;
}
