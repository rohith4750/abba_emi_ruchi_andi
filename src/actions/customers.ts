"use server"

import db from "../lib/db";
import { revalidatePath } from "next/cache";

export async function getCustomers() {
  try {
    const customers = await db.customer.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });
    return { customers, error: null };
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return { customers: [], error: error.message || "Failed to fetch customers" };
  }
}

export async function getCustomerById(id: string) {
  try {
    const customer = await db.customer.findUnique({
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
    return { customer, error: null };
  } catch (error: any) {
    console.error("Error fetching customer by ID:", error);
    return { customer: null, error: error.message || "Failed to fetch customer" };
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
    revalidatePath(`/admin/customers/${customer.id}`);
    revalidatePath("/admin");
    return { success: true, customer };
  } catch (error: any) {
    console.error("Error upserting customer:", error);
    return { success: false, error: error.message || "Failed to save customer details" };
  }
}

export async function deleteCustomer(id: string) {
  try {
    await db.customer.delete({
      where: { id },
    });
    revalidatePath("/admin/customers");
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting customer:", error);
    return { success: false, error: error.message || "Failed to delete customer" };
  }
}
