"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { upsertCustomer } from "@/actions/customers"
import { ChevronLeft, Save, User, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"

interface CustomerFormProps {
  initialData?: any
}

export default function CustomerForm({ initialData }: CustomerFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await upsertCustomer(formData)

      if (result.success) {
        toast.success(`Customer profile ${initialData ? 'updated' : 'created'} successfully`)
        router.push("/admin/customers")
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
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <Link 
          href="/admin/customers"
          className="flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">Back to Customers</span>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {initialData ? "Edit Customer Profile" : "Add New Customer"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-4 flex items-center gap-2">
               <User className="h-5 w-5 text-brand-green" /> Profile details
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                   <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Rajesh Kumar"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g., +91 XXXXX XXXXX"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Email Address (Optional)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g., rajesh@example.com"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Default Delivery Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 h-4 w-4 text-gray-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Provide detailed address for shipping..."
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/20 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Actions</h2>
            <p className="text-sm text-gray-500 italic">
              Saving this profile will allow you to link orders and track customer history across the platform.
            </p>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-brand-green text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-xl shadow-green-100 disabled:opacity-50 text-lg"
            >
              <Save className="h-6 w-6" />
              {isSubmitting ? "Saving..." : initialData ? "Update Profile" : "Create Profile"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
