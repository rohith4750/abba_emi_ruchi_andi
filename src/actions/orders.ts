"use server"

import db from "../lib/db";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
import { sendSMS } from "@/lib/sms";

export async function getOrders() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    return { orders, error: null };
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return { orders: [], error: error.message || "Failed to fetch orders" };
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const order = await db.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Send Status Update SMS
    if (status === "PREPARING" || status === "DELIVERED" || status === "CANCELLED" || status === "SHIPPED") {
      let statusText = status.toLowerCase();
      if (status === "PREPARING") statusText = "is being prepared";
      if (status === "SHIPPED") statusText = "has been shipped";
      
      const message = `Abba Emi Ruchi Andi: Your order #${orderId.slice(-6)} ${statusText}!`;
      try {
        await sendSMS(order.customerPhone, message);
      } catch (smsError) {
        console.error("Failed to send status update SMS:", smsError);
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    return { success: true, order };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message || "Failed to update status" };
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
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return { success: false, error: error.message || "Failed to delete order" };
  }
}

export async function createOrder(data: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  items: { productId: string; quantity: number; price: number; weight: string }[];
  total: number;
  userId?: string;
}) {
  try {
    const result = await db.$transaction(async (tx) => {
      let customerId: string | undefined;

      if (data.userId) {
        // If logged in, get the linked customer
        const userWithCustomer = await tx.user.findUnique({
          where: { id: data.userId },
          include: { customer: true }
        });

        if (userWithCustomer?.customer) {
          customerId = userWithCustomer.customer.id;
        }
      }

      if (!customerId) {
        // Fallback: Upsert Customer using phone number
        const customer = await tx.customer.upsert({
          where: { phone: data.customerPhone },
          update: {
            name: data.customerName,
            email: data.customerEmail,
            address: data.address,
            userId: data.userId || undefined,
          },
          create: {
            name: data.customerName,
            phone: data.customerPhone,
            email: data.customerEmail,
            address: data.address,
            userId: data.userId || undefined,
          },
        });
        customerId = customer.id;
      } else {
        // Update customer address if it changed or was empty
        await tx.customer.update({
          where: { id: customerId },
          data: { address: data.address }
        });
      }

      // 2. Create Order linked to the customer
      const order = await tx.order.create({
        data: {
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
          address: data.address,
          total: data.total,
          customerId: customerId,
          items: {
            create: data.items.map(item => ({
              quantity: item.quantity,
              price: item.price || 0,
              weight: item.weight || "Standard",
              product: {
                connect: { id: item.productId }
              }
            })),
          },
        },
      });

      return order;
    });

    // Send Confirmation SMS
    const message = `Abba Emi Ruchi Andi: Order received! Your Order ID is #${result.id.slice(-6)}. Amount: ₹${data.total}. COD will be collected at delivery.`;
    try {
      await sendSMS(data.customerPhone, message);
    } catch (smsError) {
      console.error("Failed to send order confirmation SMS:", smsError);
    }

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/admin/customers");
    revalidatePath("/");
    
    return { success: true, order: result };
  } catch (error: any) {
    console.error("Error creating order:", error);
    return { success: false, error: error.message || "Failed to process order" };
  }
}

export async function getPendingOrderCount() {
  try {
    const count = await db.order.count({
      where: { status: 'PENDING' }
    });
    return { count, error: null };
  } catch (error: any) {
    console.error("Error fetching pending order count:", error);
    return { count: 0, error: error.message || "Failed to fetch order count" };
  }
}
