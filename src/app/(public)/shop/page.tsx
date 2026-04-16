import { getProducts } from "@/actions/products"
import ProductCard from "@/components/ProductCard"

export default async function ShopPage() {
  const products = await getProducts()
  
  // Serialize for client components
  const serializedProducts = JSON.parse(JSON.stringify(products))

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-brand-saffron font-bold uppercase tracking-[0.3em] text-xs">
            The Full Collection
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-brand-green mt-4">
            Everything Homemade
          </h1>
          <p className="text-gray-500 mt-6 text-lg max-w-2xl leading-relaxed">
            From fiery pickles to aromatic podis and pure spice powders. Every single jar in our kitchen is crafted with tradition and care.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
          {serializedProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="bg-brand-cream/20 rounded-3xl p-20 text-center border-2 border-dashed border-brand-green/10">
            <h2 className="text-2xl font-bold text-gray-900">No products found</h2>
            <p className="text-gray-500 mt-2">Check back soon as we add our latest batches!</p>
          </div>
        )}
      </div>
    </div>
  )
}
