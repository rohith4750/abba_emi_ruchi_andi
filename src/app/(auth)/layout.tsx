import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-cream/20 flex flex-col lg:flex-row">
      {/* Left: Branding & Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-green relative items-center justify-center p-20 overflow-hidden">
        {/* Abstract Background patterns */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-saffron/10 rounded-full -ml-48 -mb-48 blur-3xl opacity-50" />
        
        <div className="relative z-10 text-center space-y-8 max-w-md">
          <div className="w-32 h-32 bg-white rounded-full mx-auto relative overflow-hidden shadow-2xl border-4 border-white/20">
            <Image 
              src="/logo.png" 
              alt="Abba Emi Ruchi Andi" 
              fill 
              className="object-cover scale-110"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
              A Taste of <span className="text-brand-saffron italic underline decoration-white/20 underline-offset-8">Heritage</span> in Every Bite
            </h1>
            <p className="text-white/70 text-lg leading-relaxed font-medium">
              Join our family and experience the authentic flavors of homemade Telugu pickles and podis.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Natural</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <p className="text-2xl font-bold text-white">Direct</p>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold">From Kitchen</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Auth Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-20 relative">
        {/* Mobile Header */}
        <div className="lg:hidden mb-12 text-center">
             <div className="w-20 h-20 bg-brand-green rounded-full mx-auto mb-4 relative overflow-hidden border-2 border-brand-green shadow-xl">
                <Image src="/logo.png" alt="Logo" fill className="object-cover scale-110" />
             </div>
             <h2 className="text-2xl font-bold text-brand-green">Abba Emi Ruchi Andi</h2>
        </div>

        <div className="w-full max-w-md">
          {children}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-400 font-medium">
          <p>© 2026 Abba Emi Ruchi Andi. Pure Homemade Goodness.</p>
        </div>
      </div>
    </div>
  );
}
