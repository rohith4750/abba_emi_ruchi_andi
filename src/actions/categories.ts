"use server"

import db from "../lib/db";
import { revalidatePath } from "next/cache";

export async function getCategoryById(id: string) {
  try {
    return await db.category.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return null;
  }
}

export async function getCategories() {
  try {
    return await db.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function createCategory(data: { name: string; slug: string; description?: string }) {
  try {
    const category = await db.category.create({
      data,
    });
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, category };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, data: { name?: string; slug?: string; description?: string }) {
  try {
    const category = await db.category.update({
      where: { id },
      data,
    });
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, category };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.category.delete({
      where: { id },
    });
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
