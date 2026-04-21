"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useBagStore } from "@/store/useBagStore"
import { createOrder } from "@/actions/orders"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ShoppingBag, 
  ChevronLeft, 
  Truck, 
  Phone, 
  User, 
  MapPin, 
  ArrowRight, 
  Loader2, 
  CheckCircle2,
  Package,
  Clock,
  ShieldCheck
} from "lucide-react"
import Link from "next/link"
import DynamicBackButton from "@/components/DynamicBackButton"

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, getTotalPrice, clearBag } = useBagStore()
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [orderId, setOrderId] = useState("")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout")
    }
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || "",
        phone: (session.user as any).phone || ""
      }))
    }
  }, [status, session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      toast.error("Your bag is empty")
      return
    }

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Please fill in all delivery details")
      return
    }

    setIsSubmitting(true)
    
    try {
      const orderData = {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: session?.user?.email || undefined,
        address: formData.address,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          weight: item.weight
        })),
        total: getTotalPrice(),
        userId: (session?.user as any)?.id
      }

      const result = await createOrder(orderData)

      if (result.success && result.order) {
        setOrderId(result.order.id)
        setIsSuccess(true)
        clearBag()
        toast.success("Order placed successfully!")
      } else {
        toast.error(result.error || "Failed to place order")
      }
    } catch (error) {
      console.error(error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-brand-cream/10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4 bg-white rounded-[40px] shadow-2xl p-8 sm:p-12 text-center border border-brand-green/10"
        >
          <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100">
             <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-black text-gray-900 mb-4">Order Placed ✅</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Thank you for choosing <span className="font-bold text-brand-green">Abba Emi Ruchi Andi</span>. 
            Your heritage pickles are being prepared with love!
          </p>
          
          <div className="bg-gray-50 rounded-3xl p-6 mb-8 text-left space-y-4">
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Order ID</span>
                <span className="font-mono font-bold text-gray-900">#{orderId.slice(-6).toUpperCase()}</span>
             </div>
             <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Payment</span>
                <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">Cash on Delivery</span>
             </div>
             <div className="flex justify-between items-center text-sm border-t border-gray-100 pt-4">
                <span className="text-gray-400 font-bold uppercase tracking-widest">Total Amount</span>
                <span className="text-lg font-black text-brand-green">₹{getTotalPrice()}</span>
             </div>
          </div>
          
          <div className="space-y-4">
             <Link 
               href="/admin/orders" /* Assuming they can view their orders here or redirect home */
               className="block w-full bg-brand-green text-white py-4 rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg shadow-green-100"
             >
               Track Your Order
             </Link>
             <DynamicBackButton fallback="/" label="Back to Home" className="mb-0 w-full justify-center" />
          </div>
          
          <p className="mt-8 text-[10px] text-gray-400 font-medium italic">
             A confirmation SMS has been sent to your mobile number.
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-brand-cream/5">
      <div className="container mx-auto px-4 max-w-6xl">
        <DynamicBackButton />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
               <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                  <Truck className="h-6 w-6 text-brand-green" /> Delivery Details
               </h2>
               
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                           <User className="h-3 w-3" /> Full Name
                        </label>
                        <input 
                           type="text"
                           required
                           className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-green/30 focus:bg-white rounded-2xl p-4 transition-all outline-none font-medium text-gray-900"
                           placeholder="Enter your name"
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                           <Phone className="h-3 w-3" /> Mobile Number
                        </label>
                        <input 
                           type="tel"
                           required
                           className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-green/30 focus:bg-white rounded-2xl p-4 transition-all outline-none font-medium text-gray-900"
                           placeholder="Phone number for updates"
                           value={formData.phone}
                           onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                     </div>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="h-3 w-3" /> Shipping Address
                     </label>
                     <textarea 
                        required
                        rows={4}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-green/30 focus:bg-white rounded-2xl p-4 transition-all outline-none font-medium text-gray-900 resize-none"
                        placeholder="House No, Street, Landmark, City, Pincode"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                     />
                  </div>

                  <div className="pt-4">
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Payment Method</h3>
                     <div className="p-4 bg-brand-green/5 border-2 border-brand-green rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="h-6 w-6 rounded-full bg-brand-green flex items-center justify-center text-white">
                              <ShoppingBag className="h-3 w-3" />
                           </div>
                           <span className="font-bold text-gray-900">Cash on Delivery (COD)</span>
                        </div>
                        <CheckCircle2 className="h-6 w-6 text-brand-green" />
                     </div>
                     <p className="mt-4 text-[10px] text-gray-400 font-medium italic">
                        * UPI / Card payments will be enabled soon.
                     </p>
                  </div>
               </form>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               {[
                  { icon: ShieldCheck, title: "Secure Order", desc: "Veriied by Abba Emi" },
                  { icon: Clock, title: "Fresh Batch", desc: "Packed on order" },
                  { icon: Package, title: "Heritage Pack", desc: "Safe glass jars" }
               ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
                     <item.icon className="h-6 w-6 text-brand-saffron mb-2" />
                     <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-1">{item.title}</h4>
                     <p className="text-[10px] text-gray-500">{item.desc}</p>
                  </div>
               ))}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-lg border border-gray-100 sticky top-32">
               <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>
               
               <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-gray-100">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.weight}`} className="flex justify-between items-start gap-4">
                       <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                          <p className="text-[10px] text-brand-saffron font-bold uppercase tracking-widest">
                            {item.weight} × {item.quantity}
                          </p>
                       </div>
                       <p className="font-bold text-gray-900 text-sm whitespace-nowrap">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
               </div>
               
               <div className="border-t border-dashed border-gray-200 pt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-400 font-medium">Subtotal</span>
                     <span className="text-gray-900 font-bold">₹{getTotalPrice()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                     <span className="text-gray-400 font-medium">Shipping</span>
                     <span className="text-brand-green font-bold uppercase text-[10px]">Free</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                     <span className="text-lg font-black text-gray-900">Total</span>
                     <span className="text-2xl font-black text-brand-green">₹{getTotalPrice()}</span>
                  </div>
               </div>
               
               <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || items.length === 0}
                  className="w-full bg-brand-green text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-2xl shadow-green-100 mt-8 disabled:opacity-50 group grow"
               >
                  {isSubmitting ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      Confirm Order <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
               </button>
               
               <p className="text-[10px] text-gray-400 text-center mt-6 font-medium">
                  By placing order, you agree to our Terms & Conditions
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
