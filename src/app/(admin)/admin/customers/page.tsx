import { getCustomers } from "@/actions/customers"
import CustomerList from "./CustomerList"

export default async function CustomersPage() {
  const customers = await getCustomers()
  
  // Serialize for client component
  const serializedCustomers = JSON.parse(JSON.stringify(customers))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-green">Customer Management</h1>
        <p className="text-gray-500 mt-2 italic">Manage your customer profiles and track their activity.</p>
      </div>

      <CustomerList customers={serializedCustomers} />
    </div>
  )
}
