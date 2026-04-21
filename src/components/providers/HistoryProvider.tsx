"use client"

import React, { createContext, useContext, useEffect, useState, useRef } from "react"
import { usePathname } from "next/navigation"

interface HistoryContextType {
  previousPath: string | null
  history: string[]
}

const HistoryContext = createContext<HistoryContextType>({
  previousPath: null,
  history: [],
})

export const useHistory = () => useContext(HistoryContext)

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [history, setHistory] = useState<string[]>([])
  const [previousPath, setPreviousPath] = useState<string | null>(null)
  
  // Track history changes
  useEffect(() => {
    setHistory(prev => {
      // Don't add if it's the same as current (last in history)
      if (prev.length > 0 && prev[prev.length - 1] === pathname) {
        return prev
      }
      
      const newHistory = [...prev, pathname]
      // Keep last 10 paths
      if (newHistory.length > 10) newHistory.shift()
      
      // Update previous path
      if (prev.length > 0) {
        setPreviousPath(prev[prev.length - 1])
      }
      
      return newHistory
    })
  }, [pathname])

  return (
    <HistoryContext.Provider value={{ previousPath, history }}>
      {children}
    </HistoryContext.Provider>
  )
}
