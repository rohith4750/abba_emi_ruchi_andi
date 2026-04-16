"use client"

import Image from "next/image"
import Link from "next/link"
import { useBagStore } from "@/store/useBagStore"
import { ShoppingBag, ChevronLeft, Star, ShieldCheck, Truck, History } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { motion } from "framer-motion"

interface ProductDetailProps {
  product: any
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const addItem = useBagStore(state => state.addItem)
  const [activeImage, setActiveImage] = useState(0)

  const handleAddToBag = () => {
    addItem(product)
    toast.success(`${product.name} added to your bag`, {
      description: "You can checkout via WhatsApp anytime from your bag."
    })
  }

  const images = product.images?.length > 0 ? product.images : ["/logo.png"]

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <Link 
          href={`/category/${product.category?.slug}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors mb-8 group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold uppercase tracking-widest text-xs">Back to {product.category?.name || "Category"}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Left: Gallery */}
          <div className="space-y-6">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="aspect-square relative rounded-[40px] overflow-hidden bg-brand-cream/30 border border-brand-green/5 shadow-2xl"
            >
              <Image 
                src={images[activeImage]} 
                alt={product.name} 
                fill 
                className="object-cover"
                priority
              />
              <div className="absolute top-6 right-6 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full text-brand-green font-bold text-xs shadow-lg">
                Verified Authentic
              </div>
            </motion.div>
            
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square relative rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImage === idx ? "border-brand-green scale-95" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="text-brand-saffron font-bold uppercase tracking-[0.3em] text-[10px]">
                 {product.category?.name || "Premium Selection"}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mt-4">
                <div className="flex text-brand-saffron gap-0.5">
                   {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="text-sm font-medium text-gray-500">100% Customer Satisfaction</span>
              </div>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-bold text-brand-green">
                ₹{product.price.toString()}
              </span>
              <span className="text-gray-400 line-through text-lg font-medium">₹{(Number(product.price) * 1.2).toFixed(0)}</span>
              <span className="text-brand-red text-sm font-bold bg-brand-red/10 px-2 py-1 rounded-md">Save 20%</span>
            </div>

            <div className="space-y-6 mb-8">
              <p className="text-gray-600 text-lg leading-relaxed italic border-l-4 border-brand-saffron/30 pl-6">
                "{product.description}"
              </p>
              
              {product.story && (
                 <div className="bg-brand-cream/10 rounded-3xl p-8 border border-brand-green/5 space-y-4">
                    <h3 className="text-xl font-bold text-brand-green flex items-center gap-2">
                       <History className="h-5 w-5" /> The Heritage Story
                    </h3>
                    <p className="text-gray-700 leading-relaxed font-serif whitespace-pre-wrap">
                      {product.story}
                    </p>
                 </div>
              )}
            </div>

            <div className="space-y-4 mt-auto">
              <button 
                onClick={handleAddToBag}
                className="w-full bg-brand-green text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-2xl shadow-green-100 group"
              >
                <ShoppingBag className="h-6 w-6 group-hover:rotate-12 transition-transform" /> Add to Shopping Bag
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <ShieldCheck className="h-5 w-5 text-brand-green" />
                  <span className="text-xs font-bold text-gray-700 uppercase">Chemical Free</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Truck className="h-5 w-5 text-brand-green" />
                  <span className="text-xs font-bold text-gray-700 uppercase">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
