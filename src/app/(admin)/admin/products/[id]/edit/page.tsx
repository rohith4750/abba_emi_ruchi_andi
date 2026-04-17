import { getProductById } from "@/actions/products"
import { getCategories } from "@/actions/categories"
import ProductForm from "../../ProductForm"
import { notFound } from "next/navigation"

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  
  const [product, { categories }] = await Promise.all([
    getProductById(id),
    getCategories()
  ])

  if (!product) {
    notFound()
  }

  // Serialize Decimal and Date objects for Client Component
  const serializedProduct = JSON.parse(JSON.stringify(product))
  const serializedCategories = JSON.parse(JSON.stringify(categories))

  return <ProductForm initialData={serializedProduct} categories={serializedCategories} />
}
