"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, X } from "lucide-react"

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'danger'
}: ConfirmationModalProps) {
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-[60] overflow-hidden"
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${
                  variant === 'danger' ? 'bg-red-50 text-red-600' : 
                  variant === 'warning' ? 'bg-amber-50 text-amber-600' : 
                  'bg-blue-50 text-blue-600'
                }`}>
                  <AlertCircle className="h-6 w-6" />
                </div>
                <button 
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 leading-relaxed mb-8">{message}</p>
              
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm()
                    onClose()
                  }}
                  className={`flex-1 px-6 py-3 rounded-xl text-white font-bold transition-all hover:brightness-110 shadow-lg ${
                    variant === 'danger' ? 'bg-red-600 shadow-red-200' : 
                    variant === 'warning' ? 'bg-amber-600 shadow-amber-200' : 
                    'bg-brand-green shadow-green-100'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
