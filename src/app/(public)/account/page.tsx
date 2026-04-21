import { getCustomerAccountData } from "@/actions/account"
import Navbar from "@/components/Navbar"
import DynamicBackButton from "@/components/DynamicBackButton"
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, User } from "lucide-react"
import { redirect } from "next/navigation"

export default async function AccountPage() {
    const { data, error } = await getCustomerAccountData()

    if (error || !data) {
        return (
            <>
                <Navbar />
                <div className="pt-40 pb-20 container mx-auto px-4 text-center">
                    <div className="max-w-md mx-auto bg-white rounded-[40px] p-12 border border-brand-saffron/10 shadow-xl shadow-brand-saffron/5">
                        <div className="h-20 w-20 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-8">
                            <User className="h-10 w-10 text-brand-saffron" />
                        </div>
                        <h1 className="text-3xl font-black text-brand-green font-serif mb-4">Access Denied</h1>
                        <p className="text-gray-500 mb-8">{error || "Please login to view your artisan order history."}</p>
                        <a href="/login" className="inline-block bg-brand-green text-white px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-100">
                            Log In Now
                        </a>
                    </div>
                </div>
            </>
        )
    }

    const { customer, user } = data
    const orders = customer?.orders || []

    return (
        <>
            <Navbar />
            <main className="pt-32 pb-20 bg-brand-cream/5 min-h-screen">
                {/* Background Textures */}
                <div className="fixed inset-0 opacity-[0.03] pointer-events-none -z-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
                
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-center justify-between mb-8">
                        <DynamicBackButton />
                        <div className="hidden sm:flex items-center gap-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Heritage Artisan Store / Account</span>
                        </div>
                    </div>
                    
                    {/* Hero Section */}
                    <div className="mb-12 relative">
                        <div className="absolute -top-12 -left-12 w-64 h-64 bg-brand-saffron/5 rounded-full blur-3xl -z-10" />
                        <span className="text-[10px] font-black text-brand-saffron uppercase tracking-[0.4em] block mb-2">Artisan Dashboard</span>
                        <h1 className="text-4xl md:text-6xl font-black text-brand-green font-serif">
                            {(user.name || customer?.name || "Artisan")}'s Kitchen
                        </h1>
                        <div className="mt-4 flex flex-wrap items-center gap-6">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Phone className="h-4 w-4 text-brand-saffron/60" />
                                <span>{customer?.phone || user.phone || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin className="h-4 w-4 text-brand-saffron/60" />
                                <span className="line-clamp-1">{customer?.address || "No address saved"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Profile Info Card */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white rounded-[40px] p-8 md:p-10 border border-brand-saffron/10 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-saffron/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                                
                                <h3 className="text-xl font-black text-brand-green font-serif mb-8 flex items-center gap-3">
                                    Profile Info
                                    <div className="h-1.5 w-1.5 rounded-full bg-brand-saffron" />
                                </h3>

                                <div className="space-y-6">
                                    <div className="relative z-10">
                                        <p className="text-[9px] uppercase font-black text-brand-saffron tracking-[0.2em] mb-2 opacity-60">Full Name</p>
                                        <p className="font-bold text-gray-900 border-b border-gray-50 pb-2">{user.name || "N/A"}</p>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[9px] uppercase font-black text-brand-saffron tracking-[0.2em] mb-2 opacity-60">Communication</p>
                                        <p className="font-bold text-gray-900 border-b border-gray-50 pb-2 truncate">{user.email}</p>
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-[9px] uppercase font-black text-brand-saffron tracking-[0.2em] mb-2 opacity-60">Delivery Details</p>
                                        <p className="text-sm text-gray-600 leading-relaxed italic">
                                            {customer?.address || "Please provide your address during your next artisan order checkout."}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-10 p-6 bg-brand-cream/30 rounded-3xl border border-brand-saffron/5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-saffron/5">
                                            <Package className="h-6 w-6 text-brand-saffron" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-brand-green">{orders.length}</p>
                                            <p className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">Total Batches</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders List */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-2xl font-black text-brand-green font-serif flex items-center gap-4">
                                    Recent Orders
                                    <div className="h-1.5 w-1.5 rounded-full bg-brand-saffron" />
                                </h2>
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Batch Tracking</span>
                            </div>

                            {orders.length === 0 ? (
                                <div className="bg-white rounded-[48px] p-24 text-center border border-gray-100 shadow-sm">
                                    <div className="h-24 w-24 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-saffron/10">
                                        <Clock className="h-10 w-10 text-brand-saffron opacity-40" />
                                    </div>
                                    <h3 className="text-2xl font-black text-brand-green font-serif mb-2">No heritage orders found</h3>
                                    <p className="text-gray-500 mb-8 max-w-xs mx-auto">Start your artisan collection by exploring our secret heritage recipes.</p>
                                    <a href="/shop" className="bg-brand-green text-white px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl shadow-green-200">
                                        Explore Collection
                                    </a>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {orders.map((order: any) => (
                                        <div key={order.id} className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 relative overflow-hidden group hover:shadow-2xl hover:shadow-brand-saffron/5 transition-all duration-500">
                                            {/* Status Badge Top Left */}
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-50">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-[10px] font-black text-brand-saffron uppercase tracking-[0.3em]">
                                                            Order artisan-#{order.id.slice(-6).toUpperCase()}
                                                        </span>
                                                        <div className="h-1 w-1 rounded-full bg-gray-200" />
                                                        <span className="text-xs text-gray-400 font-medium">
                                                            {new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-2xl font-black text-gray-900 tracking-tight">
                                                        ₹{Number(order.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </p>
                                                </div>

                                                <div className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                                                    order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    order.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    'bg-brand-saffron/10 text-brand-saffron border-brand-saffron/20'
                                                }`}>
                                                    {order.status}
                                                </div>
                                            </div>

                                            {/* Item Rows */}
                                            <div className="space-y-6">
                                                {order.items.map((item: any) => (
                                                    <div key={item.id} className="flex items-center justify-between group/item">
                                                        <div className="flex items-center gap-4">
                                                            <div className="h-12 w-12 rounded-2xl bg-brand-cream/40 flex flex-col items-center justify-center text-brand-saffron font-black text-[10px] border border-brand-saffron/5 group-hover/item:scale-110 transition-transform">
                                                                {item.weight}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900 group-hover/item:text-brand-green transition-colors">{item.product.name}</p>
                                                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-0.5">Quantity: {item.quantity}</p>
                                                            </div>
                                                        </div>
                                                        <p className="font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Luxury Timeline for Active Orders */}
                                            {['PENDING', 'PREPARING', 'SHIPPED'].includes(order.status) && (
                                                <div className="mt-12 pt-8 relative">
                                                    <div className="flex items-center justify-between">
                                                        {[
                                                            { label: 'Received', icon: Clock, active: true },
                                                            { label: 'Preparing', icon: Package, active: ['PREPARING', 'SHIPPED', 'DELIVERED'].includes(order.status) },
                                                            { label: 'Shipped', icon: Truck, active: ['SHIPPED', 'DELIVERED'].includes(order.status) },
                                                            { label: 'Delivered', icon: CheckCircle, active: order.status === 'DELIVERED' }
                                                        ].map((step, idx) => (
                                                            <div key={idx} className="flex flex-col items-center gap-3 relative z-10">
                                                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-700 ${step.active ? 'bg-brand-green text-white scale-110' : 'bg-gray-50 text-gray-300'}`}>
                                                                    <step.icon className="h-5 w-5" />
                                                                </div>
                                                                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${step.active ? 'text-brand-green' : 'text-gray-300'}`}>
                                                                    {step.label}
                                                                </span>
                                                            </div>
                                                        ))}
                                                        
                                                        {/* Progress Line */}
                                                        <div className="absolute top-6 left-10 right-10 h-[2px] bg-gray-50 -z-0">
                                                            <div 
                                                                className="h-full bg-brand-green transition-all duration-1000" 
                                                                style={{ 
                                                                    width: order.status === 'PENDING' ? '0%' : 
                                                                           order.status === 'PREPARING' ? '33%' : 
                                                                           order.status === 'SHIPPED' ? '66%' : '100%' 
                                                                }} 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
