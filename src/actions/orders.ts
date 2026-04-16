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
