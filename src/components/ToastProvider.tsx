"use client"

import { Toaster } from "sonner"

export function ToastProvider() {
  return (
    <Toaster 
      position="top-right"
      richColors
      expand={false}
      toastOptions={{
        style: {
          background: 'white',
          color: '#1a4332', // brand-green
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
        },
      }}
    />
  )
}
