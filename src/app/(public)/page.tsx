import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

import { getCategories } from "@/actions/categories";

export default async function Home() {
  const { categories } = await getCategories();

  // Define images for category cards
  const categoryImages: Record<string, string> = {
    'heritage-pickles': '/images/categories/heritage.png',
    'authentic-podis': '/images/categories/powders.png',
    'special-powders': '/images/categories/pickles.png', // Swapped powders/pickles to match visual density better
  };

  return (
    <main className="relative">
      <Navbar />
      <Hero />
      
      {/* Featured Sections Section */}
      <section className="py-24 bg-brand-cream/10">
        <div className="container mx-auto px-4 text-center">
          <span className="text-brand-saffron font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
             Heritage Selection
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-green mb-6">Our Signature Collections</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-16 text-lg font-medium italic text-balance">
            “Handcrafted in small batches using traditional recipes, pure ingredients, and lots of love.”
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {categories.map((category: any) => (
              <Link 
                key={category.id} 
                href={`/category/${category.slug.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative overflow-hidden rounded-[40px] aspect-[4/5] bg-gray-200 flex items-end p-10 shadow-lg hover:shadow-2xl transition-all duration-700"
              >
                {/* Background Image */}
                <Image 
                  src={categoryImages[category.slug] || '/logo.png'} 
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Premium Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity group-hover:opacity-100"></div>
                
                <div className="relative z-10 translate-y-3 group-hover:translate-y-0 transition-all duration-500 w-full">
                   <div className="w-12 h-1 bg-brand-saffron mb-4 rounded-full transition-all duration-500 group-hover:w-20"></div>
                   <h3 className="text-3xl md:text-4xl font-extrabold mb-3 text-white drop-shadow-lg">
                     {category.name}
                   </h3>
                   <p className="text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mb-6 font-medium line-clamp-2 max-w-[280px]">
                     {category.description}
                   </p>
                   <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white border-b-2 border-white/30 pb-1 group-hover:border-brand-saffron transition-colors">
                     Explore Collection <ArrowRight className="h-4 w-4" />
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-brand-green py-16 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        <div className="flex whitespace-nowrap animate-marquee relative z-10">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-6 mx-12">
               <span className="text-2xl font-bold italic tracking-wide">100% Homemade</span>
               <span className="h-2 w-2 rounded-full bg-brand-saffron shadow-[0_0_10px_rgba(234,179,8,0.8)]"></span>
               <span className="text-2xl font-bold italic tracking-wide">No Preservatives</span>
               <span className="h-2 w-2 rounded-full bg-brand-saffron shadow-[0_0_10px_rgba(234,179,8,0.8)]"></span>
               <span className="text-2xl font-bold italic tracking-wide">Traditional Telugu Recipes</span>
               <span className="h-2 w-2 rounded-full bg-brand-saffron shadow-[0_0_10px_rgba(234,179,8,0.8)]"></span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer (Premium) */}
      <footer className="bg-white py-24 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
           <div className="flex flex-col items-center mb-12">
             <div className="w-24 h-24 rounded-[35px] overflow-hidden relative mb-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 lg:w-32 lg:h-32">
               <Image 
                src="/logo.png" 
                alt="Abba Emi Ruchi Andi Heritage" 
                fill
                className="object-cover scale-110"
               />
             </div>
             <span className="text-3xl font-extrabold text-brand-green uppercase tracking-[0.2em] mb-2">ABBA EMI RUCHI ANDI</span>
             <p className="text-brand-saffron font-bold text-lg mb-4 italic">“Amma chethi ruchi… mee intiki”</p>
             <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
               Bringing Authentic Telugu Flavors from Amma’s Kitchen to Your Home. Handcrafted with love in every jar.
             </p>
           </div>
           <div className="flex justify-center flex-wrap gap-12 mb-12">
              <a href="/shop" className="text-gray-900 font-bold hover:text-brand-green transition-colors uppercase tracking-widest text-xs">Explore Menu</a>
              <a href="/our-story" className="text-gray-900 font-bold hover:text-brand-green transition-colors uppercase tracking-widest text-xs">Our Story</a>
              <a href="#" className="text-gray-900 font-bold hover:text-brand-green transition-colors uppercase tracking-widest text-xs">Privacy Policy</a>
              <a href="#" className="text-gray-900 font-bold hover:text-brand-green transition-colors uppercase tracking-widest text-xs">Contact Us</a>
           </div>
           <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.5em]">© 2026 Abba Emi Ruchi Andi • Art Food Zone</p>
        </div>
      </footer>
    </main>
  );
}
