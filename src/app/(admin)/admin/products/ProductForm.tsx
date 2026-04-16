"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { createProduct, updateProduct } from "@/actions/products"
import { ChevronLeft, Save, Plus, X, Package } from "lucide-react"
import Link from "next/link"

interface ProductFormProps {
  initialData?: any
  categories: any[]
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Parse decimal values if necessary
  const formatInitialPrice = (price: any) => {
    if (!price) return ""
    return price.toString()
  }

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    story: initialData?.story || "",
    price: formatInitialPrice(initialData?.price),
    stock: initialData?.stock || 0,
    categoryId: initialData?.categoryId || (categories.length > 0 ? categories[0].id : ""),
    images: initialData?.images || [],
  })

  const [imageUrl, setImageUrl] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const newData = { ...prev, [name]: name === "stock" ? parseInt(value) || 0 : value }
      
      if (name === "name" && (!initialData || !prev.slug)) {
        newData.slug = value.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      }
      
      return newData
    })
  }

  const addImage = () => {
    if (!imageUrl) return
    if (!imageUrl.startsWith("http")) {
      toast.error("Please enter a valid URL")
      return
    }
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, imageUrl]
    }))
    setImageUrl("")
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.categoryId) {
      toast.error("Please select a category")
      return
    }
    
    setIsSubmitting(true)

    try {
      // Convert price to Decimal/Float for Prisma
      const submissionData = {
        ...formData,
        price: parseFloat(formData.price)
      }

      const result = initialData 
        ? await updateProduct(initialData.id, submissionData)
        : await createProduct(submissionData)

      if (result.success) {
        toast.success(`Product ${initialData ? 'updated' : 'created'} successfully`)
        router.push("/admin/products")
        router.refresh()
      } else {
        toast.error(result.error || "Something went wrong")
      }
    } catch (error) {
      console.error(error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <Link 
          href="/admin/products"
          className="flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">Back to Products</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {initialData ? "Edit Product" : "Add New Product"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Product Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Avakaya Pickle"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Slug</label>
                <input
                  required
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="e.g., avakaya-pickle"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Short Description</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief summary for list views..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-medium resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">The Story (Full Content)</label>
              <textarea
                name="story"
                value={formData.story}
                onChange={handleChange}
                rows={6}
                placeholder="Narrative about the product heritage, taste profile..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-medium"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Images</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL here..."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-medium"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 bg-brand-green text-white rounded-xl hover:brightness-110 transition-all font-bold"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {formData.images.map((img: string, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {formData.images.length === 0 && (
                <div className="col-span-full py-8 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400">
                  <Package className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm font-medium">No images added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Inventory & Pricing</h2>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Price (₹)</label>
              <input
                required
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-bold text-brand-green"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Stock Level</label>
              <input
                required
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Category</label>
              <select
                required
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-medium appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-brand-green text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-xl shadow-green-100 disabled:opacity-50 text-lg"
          >
            <Save className="h-6 w-6" />
            {isSubmitting ? "Saving..." : initialData ? "Update Product" : "Publish Product"}
          </button>
        </div>
      </form>
    </div>
  )
}
