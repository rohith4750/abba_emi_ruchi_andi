"use server"

import db from "../lib/db";
import { revalidatePath } from "next/cache";

export async function getCustomers() {
  try {
    return await db.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function getCustomerById(id: string) {
  try {
    return await db.customer.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    return null;
  }
}

export async function upsertCustomer(data: {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}) {
  try {
    const customer = await db.customer.upsert({
      where: { phone: data.phone },
      update: {
        name: data.name,
        email: data.email,
        address: data.address,
      },
      create: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        address: data.address,
      },
    });
    revalidatePath("/admin/customers");
    return { success: true, customer };
  } catch (error) {
    console.error("Error upserting customer:", error);
    return { success: false, error: "Failed to save customer details" };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await db.customer.delete({
      where: { id },
    });
    revalidatePath("/admin/customers");
    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, error: "Failed to delete customer" };
  }
}
