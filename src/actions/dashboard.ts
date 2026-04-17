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

export async function getAnalyticsData() {
  try {
    // 1. Revenue trend (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const orders = await db.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: { not: 'CANCELLED' }
      },
      select: {
        createdAt: true,
        total: true,
      }
    });

    const dailyRevenue: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyRevenue[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0;
    }

    orders.forEach(order => {
      const day = new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      if (dailyRevenue[day] !== undefined) {
        dailyRevenue[day] += Number(order.total);
      }
    });

    const revenueSeries = Object.entries(dailyRevenue).reverse().map(([name, value]) => ({ name, value }));

    // 2. Category Performance
    const categoryStats = await db.category.findMany({
      include: {
        _count: {
          select: { products: true }
        },
        products: {
          select: {
            orderItems: {
              select: {
                quantity: true,
                price: true,
              }
            }
          }
        }
      }
    });

    const categoryPerformance = categoryStats.map(cat => {
      const revenue = cat.products.reduce((acc, prod) => {
        return acc + prod.orderItems.reduce((pAcc, item) => pAcc + (item.quantity * Number(item.price)), 0);
      }, 0);
      return { name: cat.name, value: revenue };
    }).filter(c => c.value > 0);

    return { 
      revenueSeries, 
      categoryPerformance: categoryPerformance.length > 0 ? categoryPerformance : [{ name: 'No Data', value: 0 }], 
      error: null 
    };
  } catch (error: any) {
    console.error("Error fetching analytics data:", error);
    return { revenueSeries: [], categoryPerformance: [], error: error.message };
  }
}
