"use client"

import Link from "next/link"
import { Eye, Clock, Award, Star } from "lucide-react"

interface ProductCardProps {
  product: any
}

export default function ProductCard({ product }: ProductCardProps) {
  const detailUrl = `/product/${product.slug.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <Link href={detailUrl} className="block group">
      <div className="relative aspect-[4/5] bg-white rounded-[48px] overflow-hidden transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(193,138,62,0.15)] group-hover:-translate-y-3 border border-gray-100/50">
        {/* Background Patterns & Textures */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cream/20 via-transparent to-brand-saffron/5" />
        
        {/* Decorative Frame */}
        <div className="absolute inset-4 border-[0.5px] border-brand-saffron/10 rounded-[40px] pointer-events-none group-hover:border-brand-saffron/30 transition-all duration-500" />
        <div className="absolute inset-6 border-[0.5px] border-brand-saffron/5 rounded-[36px] pointer-events-none" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
            {/* Header Badge */}
            <div className="mb-6 flex flex-col items-center gap-3">
                <div className="relative">
                   <Award className="h-6 w-6 text-brand-saffron/20 group-hover:text-brand-saffron/60 transition-colors duration-500" />
                   <div className="absolute inset-0 blur-sm bg-brand-saffron/10 scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[10px] font-bold text-brand-saffron uppercase tracking-[0.4em] translate-y-1 opacity-60">
                   Premium Heritage
                </span>
            </div>

            {/* Product Name - Typography focused */}
            <div className="relative mb-6">
                <h3 className="text-2xl sm:text-3xl font-black text-brand-green font-serif leading-tight group-hover:scale-110 transition-transform duration-700 ease-out">
                    {product.name}
                </h3>
            </div>

            <div className="flex items-center gap-1 mb-8">
               {[1,2,3,4,5].map(i => <Star key={i} className="h-2.5 w-2.5 fill-brand-saffron/20 text-transparent group-hover:fill-brand-saffron transition-colors" style={{ transitionDelay: `${i * 100}ms` }} />)}
            </div>

            {/* Price Tag */}
            <div className="flex flex-col items-center gap-1.5 mb-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">Authentic Batch #2024</span>
                <div className="flex items-baseline gap-1">
                   <span className="text-xs font-bold text-gray-400">₹</span>
                   <span className="text-3xl font-black text-gray-900 tracking-tight">
                      {product.price.toString()}
                   </span>
                </div>
            </div>

            {/* CTA Overlay */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 ease-in-out">
                <div className="bg-brand-green text-white px-10 py-4 rounded-full font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-green-200/50 hover:bg-gray-900 transition-colors">
                    <Eye className="h-4 w-4" /> View Details
                </div>
            </div>
        </div>

        {/* Subtle Bottom Accent */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-brand-saffron/20 rounded-t-full" />
      </div>
      
      {/* External Labeling */}
      <div className="mt-8 text-center">
          <span className="text-[9px] font-black text-brand-saffron/80 uppercase tracking-[0.4em] mb-2 block group-hover:text-brand-green transition-colors">
             {product.category?.name || "South Indian Specialty"}
          </span>
          <p className="text-xs font-medium text-gray-400 italic line-clamp-1 max-w-[200px] mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            "{product.description}"
          </p>
      </div>
    </Link>
  )
}
