"use client"

import { useState } from "react"
import { Trash2, Shield, MoreVertical, Search, Mail, User as UserIcon } from "lucide-react"
import { deleteStaffUser } from "@/actions/users"
import { toast } from "sonner"
import AddUserModal from "./AddUserModal"

export default function UserList({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the internal staff?`)) return

    const { success, error } = await deleteStaffUser(id)
    if (success) {
      setUsers(users.filter(u => u.id !== id))
      toast.success(`${name} has been removed from staff`)
    } else {
      toast.error(error || "Failed to remove staff member")
    }
  }

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
         <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
                type="text"
                placeholder="Search staff by name or email..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <AddUserModal onUserAdded={(newUser: any) => setUsers([newUser, ...users])} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-gray-50">
              <th className="px-8 py-5">Staff Member</th>
              <th className="px-8 py-5">Role / Status</th>
              <th className="px-8 py-5">Joined On</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center text-gray-400 italic">
                    No matching staff members found.
                </td>
              </tr>
            ) : filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-brand-cream/50 flex items-center justify-center text-brand-saffron border border-brand-saffron/10 group-hover:scale-110 transition-transform">
                        <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{user.name || "Unnamed Staff"}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                         <Mail className="h-3 w-3" />
                         <span>{user.email || user.username}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                    <Shield className="h-3 w-3" />
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                        disabled 
                        className="p-2 text-gray-300 cursor-not-allowed"
                        title="Edit logic coming soon"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id, user.name)}
                      className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      title="Remove Staff Access"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
