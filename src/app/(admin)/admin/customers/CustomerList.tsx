"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search, User, Phone, Mail, MapPin, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { deleteCustomer } from "@/actions/customers"
import { ConfirmationModal } from "@/components/ConfirmationModal"

export default function CustomerList({ customers }: { customers: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  
  const filteredCustomers = customers.filter(cust => 
    cust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cust.phone.includes(searchTerm) ||
    (cust.email && cust.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleDelete = async () => {
    if (!selectedCustomer) return
    
    const result = await deleteCustomer(selectedCustomer.id)
    if (result.success) {
      toast.success(`${selectedCustomer.name} removed successfully`)
    } else {
      toast.error("Failed to delete customer")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, phone or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          />
        </div>
        <Link 
          href="/admin/customers/add"
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-brand-green text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-green-100"
        >
          <Plus className="h-5 w-5" /> Add Customer
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4">Activity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">No customers found.</td>
                </tr>
              ) : filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-brand-saffron/10 flex items-center justify-center text-brand-saffron font-bold border border-brand-saffron/20">
                        {cust.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{cust.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">ID: {cust.id.slice(-8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        <Phone className="h-3 w-3 text-brand-green" />
                        {cust.phone}
                      </div>
                      {cust.email && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {cust.email}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-[200px]">
                    {cust.address ? (
                      <div className="flex items-start gap-1.5 text-xs text-gray-500 line-clamp-2">
                        <MapPin className="h-3 w-3 mt-0.5 shrink-0 text-gray-400" />
                        {cust.address}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300 italic">No address provided</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                       <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <ShoppingBag className="h-4 w-4 text-emerald-600" />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-gray-900">{cust._count?.orders || 0}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold">Total Orders</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <Link 
                        href={`/admin/customers/${cust.id}/edit`}
                        className="p-2 text-gray-400 hover:text-brand-saffron hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => {
                          setSelectedCustomer(cust)
                          setIsDeleteModalOpen(true)
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
        title="Delete Customer Profile"
        message={`Are you sure you want to remove "${selectedCustomer?.name}"? All order history association for this profile will be disconnected. This action cannot be undone.`}
        confirmText="Delete Profile"
      />
    </div>
  )
}
