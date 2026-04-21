import Image from "next/image"
import { Metadata } from 'next'
import { Heart, Sprout, History, ShieldCheck, Sun, Star } from "lucide-react"
import DynamicBackButton from "@/components/DynamicBackButton"

export const metadata: Metadata = {
  title: 'Homemade Pickles & Podis in India | Abba Emi Ruchi Andi',
  description: 'Buy authentic homemade Telugu pickles and podis online. Fresh, traditional, and made with love. Experience real Andhra flavors with Abba Emi Ruchi Andi.',
}

export default function OurStoryPage() {
  return (
    <div className="pt-32 pb-20">
      <div className="container mx-auto px-4 mb-8">
        <DynamicBackButton />
      </div>
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-brand-saffron font-bold uppercase tracking-[0.3em] text-xs">
            The Legend of Taste
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold text-brand-green mt-6 mb-8 leading-tight">
            Our Heritage, Your Home ❤️
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed max-w-3xl mx-auto italic">
            "Abba Emi Ruchi Andi is not just food… it’s a memory. Every jar we make carries the taste of home."
          </p>
        </div>
      </section>

      {/* Bilingual Story Section */}
      <section className="bg-brand-cream/10 py-24 mb-24 border-y border-brand-green/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* English Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                <span className="text-lg">🇬🇧</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">English Story</span>
              </div>
              <div className="space-y-6">
                <p className="text-2xl font-bold text-gray-900 leading-snug">
                  Abba Emi Ruchi Andi is a trusted homemade food brand offering authentic Telugu pickles and podis online in India.
                </p>
                <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                  <p>
                    Every jar we make carries the taste of home — recipes passed down from generations, prepared with love and care.
                  </p>
                  <p>
                    From spicy Avakaya pickle to flavorful Idli Karam podi, every product reflects the rich culinary heritage of Andhra, Telangana, and Rayalaseema.
                  </p>
                </div>
              </div>
            </div>

            {/* Telugu Content */}
            <div className="space-y-8 bg-white p-10 md:p-16 rounded-[40px] shadow-2xl shadow-brand-saffron/5 border border-brand-saffron/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Sun className="h-32 w-32" />
              </div>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cream rounded-full shadow-sm border border-brand-saffron/20 relative z-10">
                <span className="text-lg">🇮🇳</span>
                <span className="text-xs font-bold text-brand-saffron uppercase tracking-widest">మన కథ (Telugu)</span>
              </div>
              <div className="space-y-8 relative z-10">
                <h3 className="text-3xl md:text-4xl font-bold text-brand-green leading-tight">
                  “అబ్బా ఏమి రుచి అండి” అనిపించే ఆ ఇంటి రుచి… ఇప్పుడు మీ ఇంటికి. ❤️
                </h3>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
                  మన అమ్మలు, అమ్మమ్మలు చేసిన ఆవకాయ, పొడులు — ఆ సంప్రదాయ రుచిని మళ్లీ మీకు అందించడమే మా లక్ష్యం.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container mx-auto px-4 mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-green">Trusted Techniques</h2>
          <p className="text-gray-500 mt-4 text-lg">Not a startup, not a store—but a home kitchen.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all group">
            <div className="h-16 w-16 rounded-2xl bg-brand-green/10 flex items-center justify-center text-brand-green mb-8 group-hover:scale-110 transition-transform">
              <History className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Traditional Recipes</h4>
            <p className="text-gray-600 leading-relaxed uppercase text-xs font-bold tracking-widest opacity-60 mb-4">Heritage Records</p>
            <p className="text-gray-600 leading-relaxed">
              We use heritage recipes passed down through generations to ensure the exact taste of our ancestors' kitchens.
            </p>
          </div>

          <div className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all group">
            <div className="h-16 w-16 rounded-2xl bg-brand-saffron/10 flex items-center justify-center text-brand-saffron mb-8 group-hover:scale-110 transition-transform">
              <Sprout className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Natural Ingredients</h4>
            <p className="text-gray-600 leading-relaxed uppercase text-xs font-bold tracking-widest opacity-60 mb-4">Farm to Jar</p>
            <p className="text-gray-600 leading-relaxed">
              High-quality cold-pressed oils, hand-pounded spices, and sun-dried vegetables are the bedrock of our quality.
            </p>
          </div>

          <div className="p-10 bg-gray-50 rounded-[40px] border border-gray-100 hover:shadow-xl transition-all group">
            <div className="h-16 w-16 rounded-2xl bg-brand-red/10 flex items-center justify-center text-brand-red mb-8 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-4">Preservative Free</h4>
            <p className="text-gray-600 leading-relaxed uppercase text-xs font-bold tracking-widest opacity-60 mb-4">Pure & Healthy</p>
            <p className="text-gray-600 leading-relaxed">
              Handcrafted in small batches without any artificial colors, flavors, or chemicals. Just like Amma makes.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-brand-green rounded-[50px] p-12 md:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-10 left-10"><Star className="h-20 w-20" /></div>
             <div className="absolute bottom-10 right-10"><Heart className="h-32 w-32" /></div>
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 italic">“Amma chethi ruchi… mee intiki.”</h2>
            <p className="text-xl opacity-80 mb-12">
              Experience the soul of Andhra, Telangana & Rayalaseema in every bite. 
              Bring home the authentic Telugu flavors today.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-brand-green font-bold">
               <a href="/shop" className="bg-white px-10 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
                  Explore Handcrafted Menu
               </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
