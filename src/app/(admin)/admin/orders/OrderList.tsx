"use client"

import { useState } from "react"
import { Search, MoreVertical, Trash2, CheckCircle, Truck, XCircle, Clock } from "lucide-react"
import { toast } from "sonner"
import { updateOrderStatus, deleteOrder } from "@/actions/orders"
import { ConfirmationModal } from "@/components/ConfirmationModal"
import { cn } from "@/lib/utils"

export default function OrderList({ orders }: { orders: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  
  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerPhone.includes(searchTerm) ||
    order.id.includes(searchTerm)
  )

  const handleStatusUpdate = async (orderId: string, status: any) => {
    const result = await updateOrderStatus(orderId, status)
    if (result.success) {
      toast.success(`Order status updated to ${status}`)
    } else {
      toast.error("Failed to update status")
    }
  }

  const handleDelete = async () => {
    if (!selectedOrder) return
    const result = await deleteOrder(selectedOrder.id)
    if (result.success) {
      toast.success("Order deleted successfully")
    } else {
      toast.error("Failed to delete order")
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input 
          type="text"
          placeholder="Search by name, phone or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Order Info</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">No orders found.</td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">#{order.id.slice(-7).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {order.items.map((i: any) => `${i.product.name} (x${i.quantity})`).join(", ")}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-green">₹{order.total.toString()}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full border focus:outline-none cursor-pointer appearance-none",
                        order.status === "PENDING" ? "bg-amber-100 border-amber-200 text-amber-700" :
                        order.status === "CONFIRMED" ? "bg-blue-100 border-blue-200 text-blue-700" :
                        order.status === "SHIPPED" ? "bg-purple-100 border-purple-200 text-purple-700" :
                        order.status === "DELIVERED" ? "bg-green-100 border-green-200 text-green-700" :
                        "bg-red-100 border-red-200 text-red-700"
                      )}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => {
                        setSelectedOrder(order)
                        setIsDeleteModalOpen(true)
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order #${selectedOrder?.id.slice(-7).toUpperCase()}? This will remove all associated item data.`}
      />
    </div>
  )
}
