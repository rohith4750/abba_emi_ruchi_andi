"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { getPendingOrderCount } from "@/actions/orders";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tags, 
  Users, 
  Settings, 
  LogOut,
  ChevronLeft,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [pendingOrders, setPendingOrders] = useState(0);
  useEffect(() => {
    getPendingOrderCount().then(({ count }) => setPendingOrders(count));
  }, [pathname]);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart, badge: pendingOrders },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Customers", href: "/admin/customers", icon: Users },
  ];

  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 bg-brand-green text-white",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-20 items-center justify-between px-4 border-b border-white/10">
            {isSidebarOpen ? (
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 relative bg-white">
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    fill
                    className="object-cover scale-125"
                  />
                </div>
                <span className="text-sm font-bold leading-tight">Abba Emi<br/>Ruchi Andi</span>
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full overflow-hidden shrink-0 mx-auto relative bg-white">
                 <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  fill
                  className="object-cover scale-125"
                />
              </div>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <ChevronLeft /> : <Menu />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all group",
                    isActive 
                      ? "bg-white text-brand-green" 
                      : "hover:bg-white/10 text-white/80 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", !isSidebarOpen && "mx-auto")} />
                  {isSidebarOpen && (
                    <div className="flex-1 flex items-center justify-between">
                      <span>{item.name}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="bg-brand-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                  {!isSidebarOpen && item.badge && item.badge > 0 && (
                    <div className="absolute top-1 right-1 h-3 w-3 bg-brand-red rounded-full border-2 border-brand-green" />
                  )}
                  {!isSidebarOpen && (
                    <div className="absolute left-16 z-50 rounded-md bg-brand-green px-2 py-1 text-xs text-white opacity-0 shadow-xl group-hover:opacity-100 transition-opacity">
                      {item.name} {item.badge && item.badge > 0 && `(${item.badge})`}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="border-t border-white/10 p-4 space-y-2">
            <Link
              href="/admin/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all"
              )}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {isSidebarOpen && <span>Settings</span>}
            </Link>
            <button
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-brand-red brightness-150 hover:bg-white/10 transition-all text-left"
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white px-8 shadow-sm justify-between">
           <h1 className="text-xl font-bold text-brand-green">
             {menuItems.find(item => item.href === pathname)?.name || "Dashboard"}
           </h1>
           <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Admin User</p>
                <p className="text-sm font-medium text-gray-700">admin@abbami.com</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-brand-saffron/20 flex items-center justify-center text-brand-saffron font-bold border border-brand-saffron/30">
                A
              </div>
           </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
