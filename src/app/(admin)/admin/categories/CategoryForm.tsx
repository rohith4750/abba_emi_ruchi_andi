"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createCategory, updateCategory } from "@/actions/categories"
import { ChevronLeft, Save } from "lucide-react"
import Link from "next/link"

interface CategoryFormProps {
  initialData?: any
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: value }
      
      // Auto-generate slug from name if we are not editing or slug is empty
      if (name === "name" && (!initialData || !prev.slug)) {
        newData.slug = value.toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove non-word chars
          .replace(/\s+/g, '-')      // Replace spaces with -
          .replace(/-+/g, '-')       // Replace multiple - with single -
          .trim()
      }
      
      return newData
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = initialData 
        ? await updateCategory(initialData.id, formData)
        : await createCategory(formData)

      if (result.success) {
        toast.success(`Category ${initialData ? 'updated' : 'created'} successfully`)
        router.push("/admin/categories")
        router.refresh()
      } else {
        toast.error(result.error || "Something went wrong")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link 
          href="/admin/categories"
          className="flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">Back to Categories</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {initialData ? "Edit Category" : "Add New Category"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Category Name
            </label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Spicy Pickles"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Slug
            </label>
            <input
              required
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g., spicy-pickles"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-all font-medium"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe this category..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 transition-all font-medium resize-none"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button
            disabled={isSubmitting}
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-3 bg-brand-green text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-green-100 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {isSubmitting ? "Saving..." : initialData ? "Update Category" : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  )
}
