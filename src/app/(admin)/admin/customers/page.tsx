import { getCustomers } from "@/actions/customers"
import CustomerList from "./CustomerList"

export default async function CustomersPage() {
  const { customers, error } = await getCustomers()
  
  // Serialize for client component
  const serializedCustomers = JSON.parse(JSON.stringify(customers))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-green">Customer Management</h1>
        <p className="text-gray-500 mt-2 italic">Manage your customer profiles and track their activity.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium">
          ❌ Error: {error}
        </div>
      )}

      <CustomerList customers={serializedCustomers} />
    </div>
  )
}
