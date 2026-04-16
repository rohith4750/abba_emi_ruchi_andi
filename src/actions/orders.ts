"use server"

import db from "../lib/db";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function getOrders() {
  try {
    return await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const order = await db.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    return { success: true, order };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await db.order.delete({
      where: { id: orderId },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}

export async function createOrder(data: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
}) {
  try {
    const result = await db.$transaction(async (tx) => {
      // 1. Upsert Customer using phone number as unique key
      const customer = await tx.customer.upsert({
        where: { phone: data.customerPhone },
        update: {
          name: data.customerName,
          email: data.customerEmail,
        },
        create: {
          name: data.customerName,
          phone: data.customerPhone,
          email: data.customerEmail,
        },
      });

      // 2. Create Order linked to the customer
      const order = await tx.order.create({
        data: {
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
          total: data.total,
          customerId: customer.id,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      return order;
    });

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/customers");
    
    return { success: true, order: result };
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, error: "Failed to process order" };
  }
}

export async function getPendingOrderCount() {
  try {
    return await db.order.count({
      where: { status: 'PENDING' }
    });
  } catch (error) {
    console.error("Error fetching pending order count:", error);
    return 0;
  }
}
