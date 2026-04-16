"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { getCategories } from "@/actions/categories";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<{name: string, slug: string}[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data.map(c => ({ name: c.name, slug: c.slug })));
    });
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    ...categories.map(cat => ({
      name: cat.name,
      href: `/category/${cat.slug}`
    })),
    { name: "Our Story", href: "/our-story" },
  ];

  return (
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
              className="object-cover scale-125"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-brand-green leading-none hidden sm:block">ABBA EMI</span>
            <span className="text-[10px] font-sans text-brand-saffron tracking-[0.2em] font-semibold hidden sm:block">RUCHI ANDI</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="font-semibold text-gray-700 hover:text-brand-green transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="https://wa.me/91XXXXXXXXXX" 
            className="flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Order via WhatsApp</span>
          </Link>
          
          <button 
            className="lg:hidden p-2 text-brand-green"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="text-lg font-semibold text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
