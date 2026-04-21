import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Tags,
  AlertCircle,
  Plus
} from "lucide-react";
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getDashboardStats, getRecentOrders, getAnalyticsData } from "@/actions/dashboard";
import RevenueChart from "./components/RevenueChart";
import CategoryChart from "./components/CategoryChart";

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const { stats, error: statsError } = await getDashboardStats();
  const { orders: recentOrders, error: ordersError } = await getRecentOrders(7);
  const { revenueSeries, categoryPerformance, error: analyticsError } = await getAnalyticsData();

  const error = statsError || ordersError || analyticsError;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-serif text-brand-green">Intelligence Hub</h1>
          <p className="text-gray-500 mt-2 font-medium">Welcome back, Admin. Here's your store's performance at a glance.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/products/add" 
            className="flex items-center gap-2 bg-brand-green text-white px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-green-100"
          >
            <Plus className="h-5 w-5" /> Add Product
          </Link>
          <Link 
            href="/admin/categories/add" 
            className="flex items-center gap-2 bg-brand-saffron text-white px-5 py-2.5 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-orange-100"
          >
            <Tags className="h-5 w-5" /> New Category
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-medium flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <span>Analytics Error: {error}</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: any) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-brand-green/5 rounded-2xl group-hover:bg-brand-green/10 transition-colors">
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
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.name}</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold font-serif text-brand-green">Revenue Flow</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Last 7 Days Trend</p>
            </div>
          </div>
          <RevenueChart data={revenueSeries} />
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold font-serif text-brand-green">Category Share</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Revenue Distribution</p>
            </div>
          </div>
          <CategoryChart data={categoryPerformance} />
        </div>
      </div>

      {/* Secondary Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b flex items-center justify-between bg-gray-50/30">
            <h2 className="text-xl font-bold font-serif text-brand-green">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm font-bold text-brand-saffron hover:underline">View Ledger</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Entity</th>
                  <th className="px-8 py-4">Total</th>
                  <th className="px-8 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-gray-400 italic">No orders recorded yet.</td>
                  </tr>
                ) : recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <span className={cn(
                        "text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm",
                        order.status === "PENDING" ? "bg-amber-50 border-amber-200 text-amber-700" :
                        order.status === "PREPARING" ? "bg-blue-50 border-blue-200 text-blue-700" :
                        "bg-green-50 border-green-200 text-green-700"
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {order.items.length} items • <span className="group-hover:text-brand-green transition-colors font-medium">{order.items[0]?.product?.name}</span>
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-extrabold text-gray-900">₹{order.total.toString()}</p>
                    </td>
                    <td className="px-8 py-5 text-xs text-gray-400 font-bold uppercase tracking-wider">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity & Health */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-lg font-bold font-serif text-brand-green mb-6">Service Health</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 p-3 bg-blue-50 rounded-2xl h-fit">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Database Engine</p>
                  <p className="text-xs text-gray-500 mt-1">Neon Cloud Connected</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-green-600 uppercase">Operational</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 p-3 bg-purple-50 rounded-2xl h-fit">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Slug Normalization</p>
                  <p className="text-xs text-gray-500 mt-1">Background sync optimized</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-green-600 uppercase">Sync active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-brand-green rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ShoppingBag className="h-32 w-32" />
             </div>
             <h3 className="text-xl font-bold font-serif mb-2">Growth Tip</h3>
             <p className="text-green-50/80 text-sm leading-relaxed mb-6">
               "Avakaya Pickles" are your top converters this week. Consider featuring them in a WhatsApp blast.
             </p>
             <Link href="/admin/products" className="inline-flex py-2.5 px-6 bg-white text-brand-green rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-saffron hover:text-white transition-all">
               View Inventory
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
