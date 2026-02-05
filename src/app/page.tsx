import Link from 'next/link';
import { Leaf, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white relative overflow-hidden flex flex-col">
       
       {/* Navbar */}
       <nav className="p-6 flex justify-between items-center relative z-20">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-eco-green/10 rounded-full border border-eco-green/20">
               <Leaf className="text-eco-green" size={24} />
             </div>
             <span className="font-bold text-xl tracking-tight">EcoGenAI</span>
          </div>
          <Link href="/auth/login" className="px-6 py-2 rounded-full border border-gray-600 hover:border-gray-400 transition-colors text-sm font-medium">
             Sign In
          </Link>
       </nav>

       {/* Hero Section */}
       <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
          
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-green/10 border border-eco-green/20 text-eco-green text-sm font-medium animate-pulse-slow">
             <span className="w-2 h-2 rounded-full bg-eco-green"></span>
             AI Sustainability Interface
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
             Enterprise ESG Cockpit <br />
             <span className="text-eco-green/90 filter drop-shadow-[0_0_20px_rgba(0,255,136,0.3)]">for Generative AI</span>
          </h1>

          <p className="max-w-2xl text-lg text-gray-400 mb-10 leading-relaxed">
             Track, analyze, and optimize the carbon footprint of your LLM operations in real-time. 
             Achieve net-zero goals with granular token-level energy auditing.
          </p>

          <Link 
            href="/auth/signup"
            className="group flex items-center gap-3 px-8 py-4 bg-eco-green text-navy-900 font-bold rounded-full text-lg hover:bg-eco-light transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(0,255,136,0.4)]"
          >
             Get Started
             <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
       </main>

       {/* Background Effects */}
       <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-eco-green/5 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] delay-1000"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
       </div>

    </div>
  );
}
