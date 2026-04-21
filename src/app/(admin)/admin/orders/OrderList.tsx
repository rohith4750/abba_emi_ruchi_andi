"use client"

import { useState } from "react"
import { Search, Trash2, MapPin, Package, CreditCard } from "lucide-react"
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
    order.id.includes(searchTerm) ||
    (order.address && order.address.toLowerCase().includes(searchTerm.toLowerCase()))
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
          placeholder="Search items, users, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                <th className="px-6 py-4">Entity & Identity</th>
                <th className="px-6 py-4">Delivery Node</th>
                <th className="px-6 py-4">Payload</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Control</th>
                <th className="px-6 py-4 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">No logs found in registry.</td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-mono font-bold text-gray-900 text-sm">#{order.id.slice(-7).toUpperCase()}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                       <div className="h-1.5 w-1.5 rounded-full bg-brand-green"></div>
                       <span className="text-[10px] font-bold text-gray-700">{order.customerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    <p className="text-xs text-gray-500 font-medium flex items-start gap-1.5">
                       <MapPin className="h-3 w-3 shrink-0 mt-0.5 text-brand-saffron" />
                       <span className="line-clamp-2">{order.address || "No address provided"}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 font-bold">{order.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {order.items.map((i: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-[10px]">
                           <Package className="h-2.5 w-2.5 text-brand-green/40" />
                           <span className="font-bold text-gray-700">{i.product.name}</span>
                           <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-gray-500">
                             {i.weight} (x{i.quantity})
                           </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-extrabold text-brand-green text-sm">₹{order.total.toString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                       <CreditCard className="h-2.5 w-2.5 text-amber-500" />
                       <span className="text-[8px] font-black uppercase text-amber-600">{order.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={cn(
                        "text-[10px] font-black px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer appearance-none transition-all",
                        order.status === "PENDING" ? "bg-amber-50 border-amber-200 text-amber-700" :
                        order.status === "PREPARING" ? "bg-blue-50 border-blue-200 text-blue-700" :
                        order.status === "SHIPPED" ? "bg-purple-50 border-purple-200 text-purple-700" :
                        order.status === "DELIVERED" ? "bg-green-50 border-green-200 text-green-700" :
                        "bg-red-50 border-red-200 text-red-700"
                      )}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PREPARING">PREPARING</option>
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
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
        title="Delete Record"
        variant="danger"
        message={`Are you sure you want to delete order #${selectedOrder?.id.slice(-7).toUpperCase()}? This action is immutable and will purge all item data.`}
      />
    </div>
  )
}
