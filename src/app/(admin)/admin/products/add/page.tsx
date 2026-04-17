import { getCategories } from "@/actions/categories"
import ProductForm from "../ProductForm"

export default async function AddProductPage() {
  const { categories } = await getCategories()
  
  return <ProductForm categories={categories} />
}
