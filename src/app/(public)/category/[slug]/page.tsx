import { getProductsByCategorySlug } from "@/actions/products"
import { getCategories } from "@/actions/categories"
import ProductCard from "@/components/ProductCard"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const products = await getProductsByCategorySlug(slug)
  const allCategories = await getCategories()
  const currentCategory = allCategories.find(c => c.slug === slug)

  if (!currentCategory && products.length === 0) {
    notFound()
  }

  // Serialize for client components
  const serializedProducts = JSON.parse(JSON.stringify(products))

  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-brand-saffron font-bold uppercase tracking-[0.3em] text-xs">
            Our Collection
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-brand-green mt-4 capitalize">
            {currentCategory?.name || slug.replace("-", " ")}
          </h1>
          <p className="text-gray-500 mt-6 text-lg max-w-2xl leading-relaxed">
            {currentCategory?.description || "Experience the authentic taste of tradition. Handcrafted with love and heritage recipes passed down through generations."}
          </p>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {serializedProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-brand-cream/20 rounded-3xl p-20 text-center border-2 border-dashed border-brand-green/10">
            <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
            <p className="text-gray-500 mt-2">We're currently preparing our finest batch for this category. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
  )
}
