import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { cn } from "@/lib/utils";

import { getCategories } from "@/actions/categories";

export default async function Home() {
  const categories = await getCategories();

  // Define colors for category cards if they are missing in DB
  const categoryStyles: Record<string, string> = {
    'heritage-pickles': 'from-brand-green/80',
    'authentic-podis': 'from-brand-saffron/80',
    'special-powders': 'from-brand-red/80',
  };

  return (
    <main className="relative">
      <Navbar />
      <Hero />
      
      {/* Featured Sections Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-brand-green mb-4">Our Signature Collections</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12">
            Authentic, sun-dried, and hand-pounded delicacies from the heart of Telugu land.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category: any) => (
              <div key={category.id} className="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-brand-cream flex items-end p-8 border border-brand-green/10 shadow-sm hover:shadow-xl transition-all">
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t to-transparent opacity-60",
                  categoryStyles[category.slug] || 'from-brand-green/80'
                )}></div>
                <div className="relative z-10 text-white text-left">
                   <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                   <p className="text-sm opacity-90 mb-4">{category.description}</p>
                   <span className="text-xs font-bold uppercase tracking-widest border-b border-white pb-1">Shop Collection</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-brand-green py-12 text-white overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 mx-8">
               <span className="text-xl font-bold italic font-serif">100% Homemade</span>
               <span className="w-2 h-2 rounded-full bg-brand-saffron"></span>
               <span className="text-xl font-bold italic font-serif">No Preservatives</span>
               <span className="w-2 h-2 rounded-full bg-brand-saffron"></span>
               <span className="text-xl font-bold italic font-serif">Original Telugu Recipes</span>
               <span className="w-2 h-2 rounded-full bg-brand-saffron"></span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer (Simple) */}
      <footer className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
           <div className="mb-8">
             <span className="text-3xl font-bold text-brand-green">ABBA EMI RUCHI ANDI</span>
             <p className="text-gray-500 mt-2 italic">Amma chethi ruchi… mee intiki</p>
           </div>
           <div className="flex justify-center gap-8 mb-8 text-gray-600 font-semibold">
              <a href="#" className="hover:text-brand-green transition-colors">Instagram</a>
              <a href="#" className="hover:text-brand-green transition-colors">Facebook</a>
              <a href="#" className="hover:text-brand-green transition-colors">Contact</a>
           </div>
           <p className="text-xs text-gray-400">© 2026 Abba Emi Ruchi Andi Art Food Zone. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
