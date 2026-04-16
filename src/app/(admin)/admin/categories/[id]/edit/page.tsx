import { getCategoryById } from "@/actions/categories"
import CategoryForm from "../../CategoryForm"
import { notFound } from "next/navigation"

interface EditCategoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params
  const category = await getCategoryById(id)

  if (!category) {
    notFound()
  }

  const serializedCategory = JSON.parse(JSON.stringify(category))

  return <CategoryForm initialData={serializedCategory} />
}
