"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Search } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { deleteCategory } from "@/actions/categories"
import { ConfirmationModal } from "@/components/ConfirmationModal"

export default function CategoryList({ categories }: { categories: any[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  
  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (!selectedCategory) return
    
    const result = await deleteCategory(selectedCategory.id)
    if (result.success) {
      toast.success("Category deleted successfully")
    } else {
      toast.error("Failed to delete category")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          />
        </div>
        <Link 
          href="/admin/categories/add"
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-brand-green text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-green-100"
        >
          <Plus className="h-5 w-5" /> Add Category
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">No categories found matching your search.</td>
              </tr>
            ) : filteredCategories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{cat.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">/{cat.slug}</td>
                <td className="px-6 py-4 text-sm text-gray-500 italic">{cat.description || "No description"}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link 
                      href={`/admin/categories/${cat.id}/edit`}
                      className="p-2 text-gray-400 hover:text-brand-saffron hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button 
                      onClick={() => {
                        setSelectedCategory(cat)
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

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${selectedCategory?.name}"? This will also affect products in this category.`}
        confirmText="Delete Category"
      />
    </div>
  )
}
