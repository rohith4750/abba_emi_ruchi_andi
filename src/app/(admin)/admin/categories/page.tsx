import { getCategories } from "@/actions/categories"
import CategoryList from "./CategoryList"

export default async function CategoriesPage() {
  const categories = await getCategories()
  const serializedCategories = JSON.parse(JSON.stringify(categories))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-green">Manage Categories</h1>
        <p className="text-gray-500 mt-2 italic">Organize your pickles, podis, and powders.</p>
      </div>

      <CategoryList categories={serializedCategories} />
    </div>
  )
}
