"use server"

import db from "../lib/db";

export async function getDashboardStats() {
  // Failsafe: Normalize slugs in the background to ensure public links work
  const fixSlugs = async () => {
    try {
      const cats = await db.category.findMany();
      for (const cat of cats) {
        const normalized = cat.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        if (normalized !== cat.slug) {
          await db.category.update({ where: { id: cat.id }, data: { slug: normalized } });
        }
      }
      const prods = await db.product.findMany();
      for (const prod of prods) {
        const normalized = prod.slug.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        if (normalized !== prod.slug) {
          await db.product.update({ where: { id: prod.id }, data: { slug: normalized } });
        }
      }
    } catch (e) {
      console.error("Slug fix failed:", e);
    }
  };
  fixSlugs();

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

    const stats = [
      { name: "Total Revenue", value: `₹${totalRevenue._sum.total?.toString() || '0'}`, trend: "+0%", positive: true },
      { name: "Active Orders", value: totalOrders.toString(), trend: "+0", positive: true },
      { name: "Total Customers", value: totalCustomers.toString(), trend: "+0%", positive: true },
      { name: "Low Stock Items", value: lowStockItems.toString(), trend: "0", positive: false },
    ];
    return { stats, error: null };
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return { stats: [], error: error.message || "Failed to fetch stats" };
  }
}

export async function getRecentOrders(limit: number = 5) {
  try {
    const orders = await db.order.findMany({
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
    return { orders, error: null };
  } catch (error: any) {
    console.error("Error fetching recent orders:", error);
    return { orders: [], error: error.message || "Failed to fetch orders" };
  }
}
