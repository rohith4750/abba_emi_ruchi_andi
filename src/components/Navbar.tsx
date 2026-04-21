"use client"

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Phone, User, LogOut, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { getCategories } from "@/actions/categories";

import { useBagStore } from "@/store/useBagStore";
import BagDrawer from "./BagDrawer";

export default function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [categories, setCategories] = useState<{name: string, slug: string}[]>([]);
  const pathname = usePathname();
  const getTotalItems = useBagStore(state => state.getTotalItems);
  const [bagCount, setBagCount] = useState(0);

  useEffect(() => {
    setBagCount(getTotalItems());
  }, [getTotalItems()]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getCategories().then(({ categories: data }) => {
      setCategories(data.map(c => ({ name: c.name, slug: c.slug })));
    });
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop All", href: "/shop" },
    ...categories.map(cat => ({
      name: cat.name,
      href: `/category/${cat.slug.toLowerCase().replace(/\s+/g, '-')}`
    })),
    { name: "Our Story", href: "/our-story" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-md shadow-lg py-4" 
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden relative">
              <Image 
                src="/logo.png" 
                alt="Abba Emi Ruchi Andi Logo" 
                fill
                sizes="(max-width: 768px) 48px, 64px"
                className="object-cover scale-125"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-brand-green leading-none hidden sm:block uppercase">ABBA EMI</span>
              <span className="text-[10px] font-sans text-brand-saffron tracking-[0.2em] font-semibold hidden sm:block">RUCHI ANDI</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="font-bold text-gray-700 hover:text-brand-green transition-colors uppercase text-sm tracking-widest"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsBagOpen(true)}
              className="relative p-2 text-gray-700 hover:text-brand-green transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {bagCount > 0 && (
                <span className="absolute top-0 right-0 bg-brand-red text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                  {bagCount}
                </span>
              )}
            </button>

            {/* Desktop Auth Actions (Replacing WhatsApp) */}
            <div className="hidden sm:flex items-center gap-2">
              {session ? (
                <div className="flex items-center gap-2">
                  <Link 
                    href={session.user.role === "ADMIN" ? "/admin" : "/account"} 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-brand-cream/30 text-brand-green hover:bg-brand-cream/50 transition-all text-sm border border-brand-green/10"
                  >
                    <User className="w-4 h-4 text-brand-saffron" />
                    <span>{session.user.role === "ADMIN" ? "Admin" : "Account"}</span>
                  </Link>
                  <button 
                    onClick={() => signOut()}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link 
                    href="/login" 
                    className="px-4 py-2 font-bold text-gray-700 hover:text-brand-green transition-colors uppercase text-xs tracking-widest"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-brand-green text-white px-6 py-2.5 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all text-sm shadow-lg shadow-brand-green/20"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
            
            <button 
              className="lg:hidden p-2 text-brand-green hover:bg-brand-green/5 rounded-full transition-colors z-[110] relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Premium Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[100] bg-white flex flex-col pt-32 pb-12 px-8 lg:hidden h-screen"
            >
              <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none">
                <Image src="/logo.png" alt="" width={400} height={400} />
              </div>

              <div className="flex flex-col gap-8 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                  >
                    <Link 
                      href={link.href}
                      className={`text-4xl font-extrabold uppercase tracking-widest ${
                        pathname === link.href ? "text-brand-green" : "text-gray-900"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-12 border-t space-y-8"
              >
                {/* Mobile Auth Links */}
                {!session ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Link 
                      href="/login" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center py-4 border-2 border-gray-100 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-gray-50 transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/register" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center py-4 bg-brand-green text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-brand-green/20"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-4 bg-brand-cream/20 rounded-2xl border border-brand-cream">
                       <div className="w-12 h-12 rounded-full bg-brand-saffron/10 flex items-center justify-center text-brand-saffron text-xl font-bold">
                         {session.user.name?.[0] || 'U'}
                       </div>
                       <div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Signed in as</p>
                         <p className="text-gray-900 font-bold">{session.user.name}</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Link 
                        href={session.user.role === "ADMIN" ? "/admin" : "/account"} 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs"
                      >
                        {session.user.role === "ADMIN" ? <LayoutDashboard className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        {session.user.role === "ADMIN" ? "Admin" : "Account"}
                      </Link>
                      <button 
                        onClick={() => {
                          signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 py-4 border-2 border-red-50 text-red-500 rounded-2xl font-bold uppercase tracking-widest text-xs"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Connect with Amma</span>
                  <div className="flex gap-6 text-brand-green font-bold">
                    <a href="#" className="text-xl">Instagram</a>
                    <a href="#" className="text-xl">WhatsApp</a>
                  </div>
                </div>
                
                <p className="text-xs text-gray-400 font-medium">
                  © 2026 Abba Emi Ruchi Andi <br />
                  <span className="italic">Amma chethi ruchi… mee intiki</span>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <BagDrawer isOpen={isBagOpen} onClose={() => setIsBagOpen(false)} />
    </>
  );
}
