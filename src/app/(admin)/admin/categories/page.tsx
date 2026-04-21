import { getCategories } from "@/actions/categories"
import CategoryList from "./CategoryList"
import DynamicBackButton from "@/components/DynamicBackButton"

export default async function CategoriesPage() {
  const { categories, error } = await getCategories()
  const serializedCategories = JSON.parse(JSON.stringify(categories))

  return (
    <div className="space-y-6">
      <DynamicBackButton className="mb-2" />
      <div>
        <h1 className="text-3xl font-bold text-brand-green">Manage Categories</h1>
        <p className="text-gray-500 mt-2 italic">Organize your pickles, podis, and powders.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium">
          ❌ Error: {error}
        </div>
      )}

      <CategoryList categories={serializedCategories} />
    </div>
  )
}
