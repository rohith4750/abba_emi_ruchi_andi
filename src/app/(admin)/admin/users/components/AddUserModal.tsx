"use client"

import { useState } from "react"
import { UserPlus, X, Shield, Lock, Mail, Loader2 } from "lucide-react"
import { createStaffUser } from "@/actions/users"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function AddUserModal({ onUserAdded }: { onUserAdded: (user: any) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    username: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { success, user, error } = await createStaffUser(formData)
      if (success) {
        onUserAdded(user)
        toast.success("New staff member added successfully")
        setIsOpen(false)
        setFormData({ name: "", email: "", password: "", username: "" })
      } else {
        toast.error(error || "Failed to add staff member")
      }
    } catch (err) {
      toast.error("A technical error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-brand-green text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-transform shadow-lg shadow-green-100/50 text-sm whitespace-nowrap"
      >
        <UserPlus className="h-4 w-4" /> Add New Staff
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsOpen(false)}
               className="absolute inset-0 bg-brand-green/20 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[40px] shadow-2xl p-8 md:p-10 border border-brand-saffron/10 overflow-hidden"
            >
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-saffron/5 rounded-bl-full -mr-8 -mt-8" />
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-brand-green font-serif">Add Staff</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">New internal access</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-brand-saffron uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                     <input 
                        required
                        type="text"
                        placeholder="Artisan Admin"
                        className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all text-sm font-medium"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-brand-saffron uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                     <Mail className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                     <input 
                        required
                        type="email"
                        placeholder="staff@abbami.com"
                        className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all text-sm font-medium"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                     />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-brand-saffron uppercase tracking-widest ml-1">Security Password</label>
                  <div className="relative">
                     <Lock className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                     <input 
                        required
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-5 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all text-sm font-medium"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                     />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-brand-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-green-100 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Shield className="h-5 w-5" />}
                    Confirm Staff Access
                  </button>
                  <p className="text-[9px] text-center text-gray-400 mt-4 uppercase tracking-[0.2em] px-8">
                     Adding a member grants them full administrative access to the heritage platform.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
