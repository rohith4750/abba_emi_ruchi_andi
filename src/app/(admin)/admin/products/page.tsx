import { getProducts } from "@/actions/products"
import ProductList from "./ProductList"

export default async function ProductsPage() {
  const products = await getProducts()

  const serializedProducts = JSON.parse(JSON.stringify(products))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-green">Product Inventory</h1>
        <p className="text-gray-500 mt-2 italic">Monitor stock levels and manage your offerings.</p>
      </div>

      <ProductList products={serializedProducts} />
    </div>
  )
}
