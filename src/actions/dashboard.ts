"use server"

import db from "../lib/db";

export async function getDashboardStats() {
  try {
    const [totalRevenue, totalOrders, totalCustomers, lowStockItems] = await Promise.all([
      db.order.aggregate({
        _sum: { total: true },
        where: { status: { not: 'CANCELLED' } }
      }),
      db.order.count(),
      db.customer.count(),
      db.product.count({
        where: { stock: { lte: 5 } }
      })
    ]);

    return [
      { name: "Total Revenue", value: `₹${totalRevenue._sum.total?.toString() || '0'}`, trend: "+0%", positive: true },
      { name: "Active Orders", value: totalOrders.toString(), trend: "+0", positive: true },
      { name: "Total Customers", value: totalCustomers.toString(), trend: "+0%", positive: true },
      { name: "Low Stock Items", value: lowStockItems.toString(), trend: "0", positive: false },
    ];
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return [];
  }
}

export async function getRecentOrders(limit: number = 5) {
  try {
    return await db.order.findMany({
      take: limit,
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
    console.error("Error fetching recent orders:", error);
    return [];
  }
}
