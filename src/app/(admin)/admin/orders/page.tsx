import { getOrders } from "@/actions/orders"
import OrderList from "./OrderList"
import DynamicBackButton from "@/components/DynamicBackButton"

export default async function OrdersPage() {
  const { orders, error } = await getOrders()
  const serializedOrders = JSON.parse(JSON.stringify(orders))

  return (
    <div className="space-y-6">
      <DynamicBackButton className="mb-2" />
      <div>
        <h1 className="text-3xl font-bold text-brand-green">Order Management</h1>
        <p className="text-gray-500 mt-2 italic">Track and process your customer orders.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium">
          ❌ Error: {error}
        </div>
      )}

      <OrderList orders={serializedOrders} />
    </div>
  )
}
