"use client"

import { motion } from "framer-motion";
import { ArrowRight, Leaf, Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-12 lg:pt-[120px] lg:pb-[90px] bg-brand-cream/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full px-4 lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-[600px] mb-12 lg:mb-0 text-center lg:text-left mx-auto lg:mx-0"
            >
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
                <span className="flex items-center gap-1 text-brand-green font-semibold text-[10px] md:text-sm uppercase tracking-wider bg-brand-green/10 px-3 py-1 rounded-full border border-brand-green/20">
                  <Leaf className="w-3 md:w-4 h-3 md:h-4" /> Authentic Telugu Flavors
                </span>
                <span className="flex items-center gap-1 text-brand-red font-semibold text-[10px] md:text-sm uppercase tracking-wider bg-brand-red/10 px-3 py-1 rounded-full border border-brand-red/20">
                  <Flame className="w-3 md:w-4 h-3 md:h-4" /> Amma's touch
                </span>
              </div>
              
              <h1 className="mb-6 text-4xl sm:text-6xl lg:text-[70px] font-extrabold leading-[1.1] text-brand-green">
                Abba Emi Ruchi Andi!
              </h1>
              
              <p className="mb-10 text-lg md:text-xl leading-relaxed text-gray-700 font-sans max-w-lg mx-auto lg:mx-0">
                Experience the soul of Andhra, Seema, and Telangana in every bite. 
                Our homemade pickles and podis are crafted with heritage recipes.
                <span className="block mt-4 italic text-brand-saffron font-bold text-xl md:text-2xl">“Amma chethi ruchi… mee intiki”</span>
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all bg-brand-green rounded-2xl hover:bg-brand-green/90 hover:scale-105 active:scale-95 shadow-xl shadow-brand-green/20"
                >
                  Explore Menu
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/our-story"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-lg font-bold transition-all border-2 border-brand-green text-brand-green rounded-2xl hover:bg-brand-green/5"
                >
                  Our Story
                </Link>
              </div>
            </motion.div>
          </div>
          
          <div className="w-full px-4 lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10 lg:ml-auto mt-12 lg:mt-0"
            >
              <div className="relative w-full aspect-square max-w-[320px] sm:max-w-[500px] mx-auto group">
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-saffron/20 rounded-full blur-[60px] lg:blur-3xl group-hover:bg-brand-saffron/40 transition-all duration-500"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-brand-green/10 rounded-full blur-[60px] lg:blur-3xl group-hover:bg-brand-green/30 transition-all duration-500"></div>
                
                {/* Logo Image */}
                <div className="relative overflow-hidden rounded-[60px] lg:rounded-full border-8 border-brand-gold/30 shadow-2xl transition-transform duration-500 hover:rotate-2">
                   <div className="w-full h-full rounded-[60px] lg:rounded-full overflow-hidden relative aspect-square">
                      <Image 
                        src="/logo.png" 
                        alt="Hero Logo" 
                        fill 
                        className="object-cover scale-110"
                        priority
                      />
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Background Micro-animations */}
      <div className="absolute top-0 right-0 -z-10 opacity-20 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="150" stroke="currentColor" className="text-brand-saffron" strokeWidth="2" strokeDasharray="10 10" />
        </svg>
      </div>
    </section>
  );
}
