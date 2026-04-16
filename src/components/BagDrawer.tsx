"use client"

import { useBagStore } from "@/store/useBagStore"
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function BagDrawer({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void 
}) {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useBagStore()
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const handleWhatsAppCheckout = () => {
    const phone = "91XXXXXXXXXX" // Admin WhatsApp
    const message = `Hello Abba Emi Ruchi Andi! I'd like to place an order:
    
${items.map(item => `- ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`).join("\n")}

*Total Order Value: ₹${getTotalPrice()}*

Please confirm my order and let me know the payment details.`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between bg-brand-cream/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Bag</h2>
                  <p className="text-xs text-brand-saffron font-bold uppercase tracking-widest">{getTotalItems()} Items</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close drawer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-gray-50 flex items-center justify-center text-gray-200">
                    <ShoppingBag className="h-10 w-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Your bag is empty</h3>
                    <p className="text-sm text-gray-500 max-w-[200px] mx-auto">
                      Explore our heritage pickles and podis to fill your bag.
                    </p>
                  </div>
                  <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-brand-green text-white rounded-xl font-bold hover:brightness-110 transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gray-100 relative shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-gray-300">
                           <ShoppingBag className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 truncate pr-4">{item.name}</h4>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-brand-green mt-1">₹{item.price}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:text-brand-green transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:text-brand-green transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">Subtotal</span>
                  <span className="text-2xl font-bold text-gray-900">₹{getTotalPrice()}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium text-center italic">
                   Shipping and taxes calculated at checkout
                </p>
                <button 
                   onClick={handleWhatsAppCheckout}
                   className="w-full bg-brand-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-xl shadow-green-100 group"
                >
                  <MessageCircle className="h-6 w-6" /> Checkout via WhatsApp
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
