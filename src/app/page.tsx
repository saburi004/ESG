// import Link from 'next/link';
// import { Leaf, ArrowRight } from 'lucide-react';

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-navy-900 text-white relative overflow-hidden flex flex-col">
       
//        {/* Navbar */}
//        <nav className="p-6 flex justify-between items-center relative z-20">
//           <div className="flex items-center gap-2">
//              <div className="p-2 bg-eco-green/10 rounded-full border border-eco-green/20">
//                <Leaf className="text-eco-green" size={24} />
//              </div>
//              <span className="font-bold text-xl tracking-tight">EcoGenAI</span>
//           </div>
//           <Link href="/auth/login" className="px-6 py-2 rounded-full border border-gray-600 hover:border-gray-400 transition-colors text-sm font-medium">
//              Sign In
//           </Link>
//        </nav>

//        {/* Hero Section */}
//        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
          
//           <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-green/10 border border-eco-green/20 text-eco-green text-sm font-medium animate-pulse-slow">
//              <span className="w-2 h-2 rounded-full bg-eco-green"></span>
//              AI Sustainability Interface
//           </div>

//           <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
//              Enterprise ESG Cockpit <br />
//              <span className="text-eco-green/90 filter drop-shadow-[0_0_20px_rgba(0,255,136,0.3)]">for Generative AI</span>
//           </h1>

//           <p className="max-w-2xl text-lg text-gray-400 mb-10 leading-relaxed">
//              Track, analyze, and optimize the carbon footprint of your LLM operations in real-time. 
//              Achieve net-zero goals with granular token-level energy auditing.
//           </p>

//           <div className="flex gap-4 justify-center">
//             <Link 
//               href="/auth/signup"
//               className="group flex items-center gap-3 px-8 py-4 bg-eco-green text-navy-900 font-bold rounded-full text-lg hover:bg-eco-light transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(0,255,136,0.4)]"
//             >
//               Get Started
//               <ArrowRight className="group-hover:translate-x-1 transition-transform" />
//             </Link>

//             <Link 
//               href="/room/create"
//               className="group flex items-center gap-3 px-8 py-4 border border-eco-green/50 text-eco-green font-bold rounded-full text-lg hover:bg-eco-green/10 transition-all transform hover:scale-105"
//             >
//               Create Room
//             </Link>
//           </div>
          
//        </main>

//        {/* Background Effects */}
//        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
//           {/* Glowing orbs */}
//           <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-eco-green/5 rounded-full blur-[120px] animate-pulse-slow"></div>
//           <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] delay-1000"></div>
          
//           {/* Grid Pattern */}
//           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>
//        </div>

//     </div>
//   );
// }
'use client';
import { CSSProperties } from "react";
import Link from 'next/link';
import { Leaf, ArrowRight } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Antigravity from '../components/ui/Antigravity'

export default function LandingPage() {
  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: "black" }}>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            "--aurora": "repeating-linear-gradient(100deg,#0BE08E_10%,#45DBF1_15%,#0DB8A5_20%,#0BE08E_25%,#45DBF1_30%)",
            "--dark-gradient": "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",
            "--cyan-bright": "#0BE08E",
            "--cyan-blue": "#45DBF1",
            "--teal-dark": "#0DB8A5",
            "--black": "#000",
            "--transparent": "transparent"
          } as CSSProperties}>
          <div
            className={cn(
              `after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--dark-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-30 blur-[10px] will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--cyan-bright)_10%,var(--cyan-blue)_15%,var(--teal-dark)_20%,var(--cyan-bright)_25%,var(--cyan-blue)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] after:absolute after:inset-0 after:[background-image:var(--dark-gradient),var(--aurora)] after:[background-size:200%,_100%] after:mix-blend-difference after:content-[""]`,
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}></div>
        </div>
      </div>

      {/* Antigravity Component - Full Screen Background */}
      <div className="absolute inset-0 z-0">
        <Antigravity
          count={300}
          magnetRadius={6}
          ringRadius={2}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={1.5}
          lerpSpeed={0.05}
          color="#42c4b3ff"
          autoAnimate
          particleVariance={1}
          rotationSpeed={0}
          depthFactor={1}
          pulseSpeed={3}
          particleShape="capsule"
          fieldStrength={8}
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center relative z-20 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="p-2 bg-eco-green/20 rounded-full border border-eco-green/30 backdrop-blur-sm">
            <Leaf className="text-eco-green" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            EcoGenAI
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            href="/auth/login" 
            className="px-6 py-2 rounded-full border border-eco-green/30 hover:border-eco-green/50 transition-all text-sm font-medium backdrop-blur-sm bg-black/20 hover:bg-black/40 pointer-events-auto"
          >
            Sign In
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-20 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-green/20 border border-eco-green/40 text-eco-green text-sm font-medium backdrop-blur-sm animate-pulse-slow"
        >
          <span className="w-2 h-2 rounded-full bg-eco-green animate-pulse"></span>
          AI Sustainability Interface
        </motion.div>

   <motion.h1
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.1 }}
  className="text-5xl md:text-7xl font-semibold mb-8 tracking-tight"
>
  <span
    className="
      bg-gradient-to-r
      from-[#0bbfa5]
      via-[#14d3b3]
      to-[#2ee6c8]
      bg-clip-text
      text-transparent
    "
  >
    ESG Cockpit
  </span>

  <br />

  <span className="text-gray-200 font-normal">
    for Generative AI
  </span>
</motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-lg text-gray-300 mb-10 leading-relaxed backdrop-blur-sm bg-black/10 p-6 rounded-2xl"
        >
          Track, analyze, and optimize the carbon footprint of your LLM operations in real-time.
          Achieve net-zero goals with granular token-level energy auditing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/auth/signup"
            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-eco-green to-eco-light text-navy-900 font-bold rounded-full text-lg hover:shadow-[0_0_40px_rgba(0,255,136,0.6)] transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(0,255,136,0.4)] backdrop-blur-sm pointer-events-auto"
          >
            Get Started
            <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
          </Link>

          <Link
            href="/room/create"
            className="group flex items-center gap-3 px-8 py-4 border-2 border-eco-green/50 text-eco-green font-bold rounded-full text-lg hover:bg-eco-green/20 transition-all transform hover:scale-105 backdrop-blur-sm bg-black/20 pointer-events-auto"
          >
            Create Room
          </Link>
        </motion.div>
      </main>

      {/* Additional Glowing Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-eco-green/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] delay-1000"></div>
      </div>
    </main>
  );
}
