import { getOrders } from "@/actions/orders"
import OrderList from "./OrderList"

export default async function OrdersPage() {
  const orders = await getOrders()
  const serializedOrders = JSON.parse(JSON.stringify(orders))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-green">Order Management</h1>
        <p className="text-gray-500 mt-2 italic">Track and process your customer orders.</p>
      </div>

      <OrderList orders={serializedOrders} />
    </div>
  )
}
