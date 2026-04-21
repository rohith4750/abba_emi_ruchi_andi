import { getStaffUsers } from "@/actions/users"
import UserList from "./components/UserList"
import DynamicBackButton from "@/components/DynamicBackButton"
import { ShieldCheck, UserPlus, ShieldAlert } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const { users, error } = await getStaffUsers()

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <DynamicBackButton className="mb-4" />
          <h1 className="text-4xl font-bold font-serif text-brand-green">Security & Staff</h1>
          <p className="text-gray-500 mt-2 font-medium italic">
            Manage your internal team and artisan system administrators.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-3xl text-rose-600 font-medium flex items-center gap-3 shadow-sm">
          <ShieldAlert className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green">
                  <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                  <p className="text-2xl font-black text-gray-900">{users.length}</p>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest leading-tight">Internal Admins</p>
              </div>
          </div>
          <div className="bg-brand-saffron/5 p-6 rounded-[32px] border border-brand-saffron/10 shadow-sm col-span-2 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-brand-saffron shadow-sm">
                    <UserPlus className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-bold text-brand-green">Expand Your Team</h3>
                    <p className="text-xs text-gray-500">Add trusted members to help manage the artisan store.</p>
                </div>
              </div>
          </div>
      </div>

      <UserList initialUsers={users} />
    </div>
  )
}
