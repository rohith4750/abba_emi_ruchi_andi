"use client"

import { SessionProvider } from "next-auth/react"
import { HistoryProvider } from "./providers/HistoryProvider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <HistoryProvider>
        {children}
      </HistoryProvider>
    </SessionProvider>
  )
}
