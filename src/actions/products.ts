"use server"

import db from "../lib/db";
import { revalidatePath } from "next/cache";

export async function getProductById(id: string) {
  try {
    return await db.product.findUnique({
      where: { id },
      include: { category: true },
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

export async function getProductsByCategorySlug(slug: string) {
  try {
    const category = await db.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: { category: true }
        }
      }
    });

    return category ? category.products : [];
  } catch (error) {
    console.error("Error fetching products by category slug:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    return await db.product.findUnique({
      where: { slug },
      include: { category: true }
    });
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}

export async function getProducts() {
  try {
    return await db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getFeaturedProducts(limit = 6) {
  try {
    return await db.product.findMany({
      take: limit,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export async function createProduct(data: any) {
  try {
    const product = await db.product.create({
      data,
    });
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const product = await db.product.update({
      where: { id },
      data,
    });
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true, product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await db.product.delete({
      where: { id },
    });
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
