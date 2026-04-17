import { getProductBySlug } from "@/actions/products"
import ProductDetail from "./ProductDetail"
import { notFound } from "next/navigation"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const { product, error } = await getProductBySlug(slug)

  if (!product || error) {
    notFound()
  }

  // Serialize for client component
  const serializedProduct = JSON.parse(JSON.stringify(product))

  return <ProductDetail product={serializedProduct} />
}
