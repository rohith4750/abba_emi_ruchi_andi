"use client"

import Link from "next/link"
import { useBagStore } from "@/store/useBagStore"
import { ShoppingBag, ChevronLeft, Star, ShieldCheck, Truck, History, Check } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import DynamicBackButton from "@/components/DynamicBackButton"

interface ProductDetailProps {
  product: any
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const addItem = useBagStore(state => state.addItem)
  
  // Default to 250g if sizes exist, otherwise use base product price
  const availableSizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : [{ weight: '250g', price: product.price, id: 'base' }];
    
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);

  const handleAddToBag = () => {
    addItem(product, selectedSize.weight, Number(selectedSize.price))
    toast.success(`${product.name} (${selectedSize.weight}) added to bag`, {
      description: "You can proceed to checkout from your shopping bag."
    })
  }

  return (
    <div className="pt-32 pb-20 bg-brand-cream/10">
      <div className="container mx-auto px-4">
        <DynamicBackButton />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Left: Decorative Name Banner (No Images) */}
          <div className="space-y-6">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="aspect-square relative rounded-[40px] overflow-hidden bg-gradient-to-br from-brand-green to-brand-green/80 flex items-center justify-center p-8 sm:p-12 shadow-2xl shadow-green-200/50"
            >
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
              
              <div className="w-full h-full border-4 border-brand-saffron/30 rounded-[32px] flex flex-col items-center justify-center p-6 border-double relative">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-saffron px-6 py-1 text-[10px] font-black text-white uppercase tracking-[0.4em] rounded-full shadow-lg">
                    Premium Quality
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black text-white font-serif text-center leading-tight drop-shadow-md">
                    {product.name}
                  </h1>

                  <div className="mt-8 flex flex-col items-center gap-4">
                    <div className="flex text-brand-saffron gap-1">
                       {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-[0.2em] bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                      Authentic Telugu Heritage
                    </span>
                  </div>
              </div>
            </motion.div>
            
            <div className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center justify-between shadow-sm">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-brand-saffron/10 flex items-center justify-center text-brand-saffron">
                     <Check className="h-5 w-5" />
                  </div>
                  <div>
                     <p className="text-sm font-bold text-gray-900 leading-tight">Freshly Prepared</p>
                     <p className="text-[10px] text-gray-500 font-medium">Batch No. #AB-2024</p>
                  </div>
               </div>
               <div className="h-10 w-[1px] bg-gray-100" />
               <div className="text-right">
                  <p className="text-sm font-bold text-brand-green uppercase tracking-widest">Natural</p>
                  <p className="text-[10px] text-gray-500 font-medium whitespace-nowrap">No Preservatives</p>
               </div>
            </div>
          </div>

          {/* Right: Info & Sizes */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="text-brand-saffron font-bold uppercase tracking-[0.3em] text-[10px]">
                 {product.category?.name || "Premium Selection"}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                Pure {product.name}
              </h1>
              <p className="text-gray-500 mt-4 text-lg leading-relaxed italic border-l-4 border-brand-saffron/30 pl-6">
                "{product.description}"
              </p>
            </div>

            {/* Size Selection */}
            <div className="mb-10">
               <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Choose Quantity</h3>
               <div className="grid grid-cols-3 gap-3">
                  {availableSizes.map((size: any) => (
                     <button
                        key={size.weight}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                           "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-1",
                           selectedSize.weight === size.weight 
                              ? "border-brand-green bg-brand-green/5 shadow-inner" 
                              : "border-gray-100 bg-white hover:border-brand-saffron/30"
                        )}
                     >
                        <span className={cn(
                           "text-xs font-bold uppercase tracking-widest",
                           selectedSize.weight === size.weight ? "text-brand-green" : "text-gray-400"
                        )}>
                           {size.weight}
                        </span>
                        <span className={cn(
                           "text-lg font-black",
                           selectedSize.weight === size.weight ? "text-brand-green" : "text-gray-900"
                        )}>
                           ₹{size.price.toString()}
                        </span>
                     </button>
                  ))}
               </div>
            </div>

            <div className="flex items-center gap-6 mb-10">
               <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Price</span>
                  <span className="text-4xl font-black text-brand-green">₹{selectedSize.price.toString()}</span>
               </div>
               <div className="flex flex-col px-4 py-2 bg-brand-red/10 rounded-xl border border-brand-red/20">
                  <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest">Inclusive of taxes</span>
                  <span className="text-xs font-bold text-brand-red">Shipping calculated at checkout</span>
               </div>
            </div>

            <div className="space-y-6">
               <button 
                  onClick={handleAddToBag}
                  className="w-full bg-brand-green text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-2xl shadow-green-100 group"
               >
                  <ShoppingBag className="h-6 w-6 group-hover:rotate-12 transition-transform" /> Add to Shopping Bag
               </button>

               {product.story && (
                  <div className="bg-white rounded-3xl p-8 border border-brand-green/5 space-y-4 shadow-sm">
                     <h3 className="text-xl font-bold text-brand-green flex items-center gap-2">
                        <History className="h-5 w-5" /> The Heritage Story
                     </h3>
                     <p className="text-gray-700 leading-relaxed font-serif whitespace-pre-wrap text-sm italic">
                        {product.story}
                     </p>
                  </div>
               )}
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                     <ShieldCheck className="h-5 w-5 text-brand-green" />
                     <span className="text-[10px] font-bold text-gray-700 uppercase">100% Homemade</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                     <Truck className="h-5 w-5 text-brand-green" />
                     <span className="text-[10px] font-bold text-gray-700 uppercase">Safe Delivery</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
