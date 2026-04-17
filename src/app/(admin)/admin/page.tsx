import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Tags
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getDashboardStats, getRecentOrders } from "@/actions/dashboard";

export default async function AdminDashboard() {
  const { stats, error: statsError } = await getDashboardStats();
  const { orders: recentOrders, error: ordersError } = await getRecentOrders();

  const error = statsError || ordersError;

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium">
          ❌ Error: {error}
        </div>
      )}
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: any) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-brand-green/10 rounded-lg">
                {stat.name === "Total Revenue" && <DollarSign className="h-6 w-6 text-brand-green" />}
                {stat.name === "Active Orders" && <ShoppingBag className="h-6 w-6 text-brand-green" />}
                {stat.name === "Total Customers" && <Users className="h-6 w-6 text-brand-green" />}
                {stat.name === "Low Stock Items" && <TrendingUp className="h-6 w-6 text-brand-green" />}
              </div>
              <span className={cn(
                "flex items-center text-xs font-bold px-2 py-1 rounded-full",
                stat.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                {stat.positive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {stat.trend}
              </span>
            </div>
            <p className="text-gray-500 text-sm font-medium">{stat.name}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold font-serif text-brand-green">Recent Orders</h2>
            <button className="text-sm font-bold text-brand-saffron hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No recent orders found.</td>
                  </tr>
                ) : recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{order.id.slice(-7).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">
                        {order.items.map((i: any) => i.product.name).join(", ")}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-brand-green">₹{order.total.toString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-1 rounded-full border",
                        order.status === "PENDING" ? "bg-amber-100 border-amber-200 text-amber-700" :
                        order.status === "CONFIRMED" ? "bg-blue-100 border-blue-200 text-blue-700" :
                        "bg-green-100 border-green-200 text-green-700"
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold font-serif text-brand-green mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center gap-3 p-3 bg-brand-green text-white rounded-xl font-bold hover:brightness-110 transition-all">
                <ShoppingBag className="h-5 w-5" /> Add New Product
              </button>
              <button className="flex items-center gap-3 p-3 bg-brand-saffron text-white rounded-xl font-bold hover:brightness-110 transition-all">
                <Tags className="h-5 w-5" /> Manage Categories
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold font-serif text-brand-green mb-6">Recent Activity</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-blue-100 rounded-lg h-fit">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Inventory Sync</p>
                  <p className="text-xs text-gray-500">Connected to live database</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">Just now</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 p-2 bg-green-100 rounded-lg h-fit">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                   <p className="text-sm font-medium text-gray-900">System Ready</p>
                   <p className="text-xs text-gray-500">Database migrated successfully</p>
                   <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">1 minute ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
