"use server"

import db from "../lib/db";
import { revalidatePath } from "next/cache";

export async function getProductById(id: string) {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: { category: true, sizes: true },
    });
    return { product, error: null };
  } catch (error: any) {
    console.error("Error fetching product by ID:", error);
    return { product: null, error: error.message || "Failed to fetch product" };
  }
}

export async function getProductsByCategorySlug(slug: string) {
  try {
    const category = await db.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: { category: true, sizes: true }
        }
      }
    });

    return { products: category ? category.products : [], error: null };
  } catch (error: any) {
    console.error("Error fetching products by category slug:", error);
    return { products: [], error: error.message || "Failed to fetch products" };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: { category: true, sizes: true }
    });
    return { product, error: null };
  } catch (error: any) {
    console.error("Error fetching product by slug:", error);
    return { product: null, error: error.message || "Failed to fetch product" };
  }
}

export async function getProducts() {
  try {
    const products = await db.product.findMany({
      include: { category: true, sizes: true },
      orderBy: { createdAt: 'desc' },
    });
    return { products, error: null };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return { products: [], error: error.message || "Failed to fetch products" };
  }
}

export async function getFeaturedProducts(limit = 6) {
  try {
    const products = await db.product.findMany({
      take: limit,
      include: { category: true, sizes: true },
      orderBy: { createdAt: 'desc' },
    });
    return { products, error: null };
  } catch (error: any) {
    console.error("Error fetching featured products:", error);
    return { products: [], error: error.message || "Failed to fetch products" };
  }
}

export async function createProduct(data: any) {
  try {
    const product = await db.product.create({
      data,
    });
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/category/${product.categoryId}`); 
    return { success: true, product };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message || "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const product = await db.product.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/product/${product.slug}`);
    return { success: true, product };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message || "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    const product = await db.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message || "Failed to delete product" };
  }
}
