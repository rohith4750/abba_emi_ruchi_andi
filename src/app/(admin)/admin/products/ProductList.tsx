"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { deleteProduct } from "@/actions/products"
import { ConfirmationModal } from "@/components/ConfirmationModal"

export default function ProductList({ products }: { products: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  
  const filteredProducts = products.filter(prod => 
    prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (!selectedProduct) return
    
    const result = await deleteProduct(selectedProduct.id)
    if (result.success) {
      toast.success(`${selectedProduct.name} deleted successfully`)
    } else {
      toast.error("Failed to delete product")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          />
        </div>
        <Link 
          href="/admin/products/add"
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-brand-green text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-green-100"
        >
          <Plus className="h-5 w-5" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">No products found.</td>
                </tr>
              ) : filteredProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-brand-cream flex items-center justify-center overflow-hidden border border-brand-green/5">
                        {prod.images?.[0] ? (
                          <img src={prod.images[0]} alt={prod.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-5 w-5 text-brand-green/40" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{prod.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">/{prod.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold px-2 py-1 bg-brand-green/10 text-brand-green rounded-full">
                      {prod.category?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-green">₹{prod.price.toString()}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <span className={prod.stock <= 5 ? "text-red-600 font-bold" : "text-gray-500"}>
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <Link 
                        href={`/admin/products/${prod.id}/edit`}
                        className="p-2 text-gray-400 hover:text-brand-saffron hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => {
                          setSelectedProduct(prod)
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
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        confirmText="Remove Product"
      />
    </div>
  )
}
