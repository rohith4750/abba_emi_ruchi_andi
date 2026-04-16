"use client"

import Image from "next/image"
import Link from "next/link"
import { useBagStore } from "@/store/useBagStore"
import { ShoppingBag, Eye, Heart } from "lucide-react"
import { toast } from "sonner"

interface ProductCardProps {
  product: any
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useBagStore(state => state.addItem)

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success(`${product.name} added to your bag`)
  }

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-saffron/10 hover:-translate-y-2 relative">
      {/* Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 bg-brand-green/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
          Handmade
        </span>
      </div>

      {/* Action Buttons (Hover) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
        <button className="h-10 w-10 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-400 hover:text-brand-red transition-colors">
          <Heart className="h-5 w-5" />
        </button>
        <Link 
          href={`/product/${product.slug.toLowerCase().replace(/\s+/g, '-')}`}
          className="h-10 w-10 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-400 hover:text-brand-green transition-colors"
        >
          <Eye className="h-5 w-5" />
        </Link>
      </div>

      {/* Image Container */}
      <Link href={`/product/${product.slug.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="aspect-[4/5] relative overflow-hidden bg-brand-cream/30">
          {product.images?.[0] ? (
            <Image 
              src={product.images[0]} 
              alt={product.name} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center italic text-gray-300">
               Image Coming Soon
            </div>
          )}
          {/* Add to Bag Overly (Mobile Optimized) */}
          <div className="absolute inset-x-0 bottom-0 p-2 sm:p-4 bg-gradient-to-t from-black/20 to-transparent">
             <button 
                onClick={handleAddToBag}
                className="w-full bg-brand-green text-white py-2 sm:py-3 rounded-xl font-bold flex items-center justify-center gap-1 sm:gap-2 shadow-lg hover:brightness-110 transition-all text-[10px] sm:text-sm"
             >
                <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4" /> Add
             </button>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3 sm:p-6">
        <Link href={`/category/${product.category?.slug.toLowerCase().replace(/\s+/g, '-')}`}>
          <span className="text-[8px] sm:text-[10px] uppercase font-bold text-brand-saffron tracking-widest hover:text-brand-green transition-colors">
            {product.category?.name || "Pickles"}
          </span>
        </Link>
        <Link href={`/product/${product.slug.toLowerCase().replace(/\s+/g, '-')}`}>
          <h3 className="text-xs sm:text-lg font-bold text-gray-900 mt-0.5 sm:mt-1 line-clamp-1 group-hover:text-brand-green transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="hidden sm:block text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed h-8">
          {product.description}
        </p>
        
        <div className="mt-2 sm:mt-4 flex items-center justify-between">
          <span className="text-sm sm:text-xl font-bold text-brand-green">
            ₹{product.price.toString()}
          </span>
          <div className="hidden sm:flex items-center gap-1">
             <div className="h-1 w-1 rounded-full bg-brand-green" />
             <span className="text-[10px] font-bold text-gray-400 uppercase">Available</span>
          </div>
        </div>
      </div>
    </div>
  )
}
