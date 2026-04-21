"use client"

import { usePathname, useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useHistory } from "./providers/HistoryProvider"

interface DynamicBackButtonProps {
  fallback?: string
  label?: string
  className?: string
}

export default function DynamicBackButton({ fallback, label, className }: DynamicBackButtonProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { previousPath } = useHistory()

  // Calculate parent path for hierarchical navigation (Logical Fallback)
  const segments = pathname.split('/').filter(Boolean)
  let calculatedParent = "/"
  
  if (segments.length > 0) {
    if (segments[0] === 'admin' && segments.length > 1) {
      calculatedParent = '/' + segments.slice(0, segments.length - 1).join('/')
    } else if (segments[0] === 'product' || segments[0] === 'category') {
      calculatedParent = '/shop'
    } else if (segments[0] === 'checkout') {
      calculatedParent = '/shop'
    } else if (segments.length > 1) {
      calculatedParent = '/' + segments.slice(0, -1).join('/')
    }
  }

  // Determine the final destination: 
  // Prefer the actual previous path if it exists and is different from current
  const targetPath = (previousPath && previousPath !== pathname) ? previousPath : (fallback || calculatedParent)

  // Determine dynamic label
  const getDynamicLabel = () => {
    if (label) return label
    
    const targetSegments = targetPath.split('/').filter(Boolean)
    if (targetSegments.length === 0 || targetPath === '/') return "Back to Home"
    
    // Check for some common patterns to make labels more friendly
    const lastSegment = targetSegments[targetSegments.length - 1]
    
    if (lastSegment === 'admin') return "Back to Dashboard"
    if (lastSegment === 'shop') return "Back to Shop"
    if (lastSegment === 'orders') return "Back to Orders"
    if (lastSegment === 'products') return "Back to Products"
    if (lastSegment === 'customers') return "Back to Customers"
    if (lastSegment === 'categories') return "Back to Categories"
    if (lastSegment === 'our-story') return "Back to Our Story"
    
    // Generic formatting: capitalize and replace hyphens
    const formatted = lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      
    // If it's a UUID or ID-like segment (usually in admin or product slugs), truncate or simplify
    if (lastSegment.length > 20) return "Go Back"
      
    return `Back to ${formatted}`
  }

  const handleBack = (e: React.MouseEvent) => {
    // If we have a previous path in history, use router.back() for smoother transition
    // else use the targetPath Link behavior
    if (previousPath && previousPath === targetPath) {
      e.preventDefault()
      router.back()
    }
  }

  return (
    <button 
      onClick={(e) => {
        handleBack(e)
        if (!previousPath || previousPath !== targetPath) {
          router.push(targetPath)
        }
      }}
      className={cn(
        "inline-flex items-center gap-2 text-gray-500 hover:text-brand-green transition-colors mb-8 group",
        className
      )}
    >
      <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
      <span className="font-bold uppercase tracking-widest text-[10px] sm:text-xs">
        {getDynamicLabel()}
      </span>
    </button>
  )
}
