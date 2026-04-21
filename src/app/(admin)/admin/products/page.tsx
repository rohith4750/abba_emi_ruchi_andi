import { getProducts } from "@/actions/products"
import ProductList from "./ProductList"
import DynamicBackButton from "@/components/DynamicBackButton"

export default async function ProductsPage() {
  const { products, error } = await getProducts()

  const serializedProducts = JSON.parse(JSON.stringify(products))

  return (
    <div className="space-y-6">
      <DynamicBackButton className="mb-2" />
      <div>
        <h1 className="text-3xl font-bold text-brand-green">Product Inventory</h1>
        <p className="text-gray-500 mt-2 italic">Monitor stock levels and manage your offerings.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium">
          ❌ Error: {error}
        </div>
      )}

      <ProductList products={serializedProducts} />
    </div>
  )
}
