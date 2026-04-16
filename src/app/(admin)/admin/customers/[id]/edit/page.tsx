import { getCustomerById } from "@/actions/customers"
import CustomerForm from "../../CustomerForm"
import { notFound } from "next/navigation"

interface EditCustomerPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = await params
  const customer = await getCustomerById(id)

  if (!customer) {
    notFound()
  }

  // Serialize for client component
  const serializedCustomer = JSON.parse(JSON.stringify(customer))

  return <CustomerForm initialData={serializedCustomer} />
}
