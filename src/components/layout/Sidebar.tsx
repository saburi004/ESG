// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { 
//   LayoutDashboard, 
//   Lightbulb, 
//   MessageSquare, 
//   PlusCircle, 
//   ChevronLeft, 
//   ChevronRight,
//   LogOut,
//   Leaf
// } from 'lucide-react';
// import { signOut } from 'next-auth/react';
// import { cn } from '@/lib/utils';
// import clsx from 'clsx';
// import { twMerge } from 'tailwind-merge';



// const MENU_ITEMS = [
//   { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
//   { name: 'Suggestions', href: '/suggestions', icon: Lightbulb },
//   { name: 'Ask About Project', href: '/ask', icon: MessageSquare },
//   { name: 'Connect Project', href: '/connect', icon: PlusCircle },
// ];

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     // Auto collapse on mobile
//     if (window.innerWidth < 768) {
//       setCollapsed(true);
//     }
//   }, []);

//   return (
//     <aside 
//       className={cn(
//         "h-screen bg-navy-900 shadow-[4px_0_30px_rgba(0,0,0,0.3)] transition-all duration-500 ease-in-out flex flex-col relative z-50",
//         collapsed ? "w-20" : "w-64"
//       )}
//     >
//       {/* Header */}
//       <div className="p-6 flex items-center justify-between h-20">
//         <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-500", collapsed && "justify-center w-full")}>
//            <Leaf className="w-8 h-8 text-eco-green shrink-0 animate-pulse-slow" />
//            <span className={cn("text-xl font-bold text-white whitespace-nowrap transition-opacity", collapsed ? "opacity-0 hidden" : "opacity-100")}>
//              EcoGenAI
//            </span>
//         </div>
//       </div>

//       {/* Toggle Button */}
//       <button 
//         onClick={() => setCollapsed(!collapsed)}
//         className="absolute -right-3 top-24 bg-navy-800 text-gray-400 rounded-full p-1.5 shadow-lg shadow-black/20 hover:text-eco-green hover:scale-110 transition-all duration-300 transform"
//       >
//         {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
//       </button>

//       {/* Nav Items */}
//       <nav className="flex-1 py-6 px-2 space-y-2">
//         {MENU_ITEMS.map((item) => {
//           const isActive = pathname === item.href;
//           const Icon = item.icon;
          
//           return (
//             <Link 
//               key={item.href} 
//               href={item.href}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
//                 isActive 
//                   ? "bg-eco-green/10 text-eco-green shadow-inner" 
//                   : "text-gray-400 hover:bg-white/5 hover:text-gray-100 hover:translate-x-1"
//               )}
//             >
//                {/* Active Indicator Line */}
//                {isActive && (
//                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-eco-green shadow-[0_0_8px_#00ff88]" />
//                )}

//                <Icon size={24} className={cn("shrink-0 transition-transform group-hover:scale-110", isActive && "animate-pulse")} />
               
//                <span className={cn("whitespace-nowrap transition-opacity duration-300", collapsed ? "opacity-0 hidden" : "opacity-100")}>
//                  {item.name}
//                </span>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Footer / Logout */}
//       <div className="p-6">
//         <button 
//           onClick={() => signOut({ callbackUrl: '/auth/login' })}
//           className={cn(
//             "flex items-center gap-3 px-3 py-3 rounded-xl w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/10 group",
//              collapsed && "justify-center"
//           )}
//         >
//           <LogOut size={24} />
//           <span className={cn("whitespace-nowrap transition-opacity", collapsed ? "opacity-0 hidden" : "opacity-100")}>
//             Sign Out
//           </span>
//         </button>
//       </div>
//     </aside>
//   );
// }
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { 
//   LayoutDashboard, 
//   Lightbulb, 
//   MessageSquare, 
//   PlusCircle, 
//   ChevronLeft, 
//   ChevronRight,
//   LogOut,
//   Leaf
// } from 'lucide-react';
// import { signOut } from 'next-auth/react';
// import { cn } from '@/lib/utils';
// import clsx from 'clsx';
// import { twMerge } from 'tailwind-merge';



// const MENU_ITEMS = [
//   { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
//   { name: 'Suggestions', href: '/suggestions', icon: Lightbulb },
//   { name: 'Ask About Project', href: '/ask', icon: MessageSquare },
//   { name: 'Connect Project', href: '/connect', icon: PlusCircle },
// ];

// export default function Sidebar() {
//   const [collapsed, setCollapsed] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     // Auto collapse on mobile
//     if (window.innerWidth < 768) {
//       setCollapsed(true);
//     }
//   }, []);

//   return (
//     <aside 
//       className={cn(
//         "h-screen bg-[#0a0f1c] shadow-[4px_0_30px_rgba(0,0,0,0.3)] transition-all duration-500 ease-in-out flex flex-col relative z-50 overflow-hidden",
//         collapsed ? "w-20" : "w-64"
//       )}
//       style={{
//         boxShadow: '4px 0 40px rgba(16, 185, 129, 0.15), inset -1px 0 20px rgba(16, 185, 129, 0.05)'
//       }}
//     >
//       {/* Background Decorative Elements */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         {/* Emerald Glow Orbs */}
//         <div className="absolute top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-20 -right-10 w-32 h-32 bg-emerald-400/8 rounded-full blur-2xl animate-pulse delay-700"></div>
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>
        
        
        
        

//         {/* <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div> */}
//       </div>

//       {/* Header */}
//       <div className="p-6 flex items-center justify-between h-20 relative z-10">
//         <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-500", collapsed && "justify-center w-full")}>
//            <div className="relative">
//              <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-md animate-pulse"></div>
//              <Leaf className="w-8 h-8 text-eco-green shrink-0 relative" />
//            </div>
//            <span className={cn("text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent whitespace-nowrap transition-opacity", collapsed ? "opacity-0 hidden" : "opacity-100")}>
//              EcoGenAI
//            </span>
//         </div>
//       </div>

//       {/* Toggle Button */}
//       <button 
//         onClick={() => setCollapsed(!collapsed)}
//         className="absolute -right-3 top-24 bg-[#0a0f1c] border border-emerald-500/30 text-gray-400 rounded-full p-1.5 shadow-lg shadow-emerald-900/20 hover:text-eco-green hover:scale-110 hover:border-emerald-400/50 transition-all duration-300 transform z-50"
//       >
//         {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
//       </button>

//       {/* Nav Items */}
//       <nav className="flex-1 py-6 px-2 space-y-2 relative z-10">
//         {MENU_ITEMS.map((item) => {
//           const isActive = pathname === item.href;
//           const Icon = item.icon;
          
//           return (
//             <Link 
//               key={item.href} 
//               href={item.href}
//               className={cn(
//                 "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
//                 isActive 
//                   ? "bg-emerald-500/10 text-eco-green shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-500/20" 
//                   : "text-gray-400 hover:bg-emerald-500/5 hover:text-gray-100 hover:translate-x-1 border border-transparent hover:border-emerald-500/10"
//               )}
//             >
//                {/* Active Indicator Line */}
//                {isActive && (
//                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
//                )}

//                {/* Hover Glow Effect */}
//                <div className={cn(
//                  "absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
//                  isActive && "opacity-100"
//                )}></div>

//                <Icon size={24} className={cn("shrink-0 transition-transform group-hover:scale-110 relative z-10", isActive && "drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]")} />
               
//                <span className={cn("whitespace-nowrap transition-opacity duration-300 relative z-10", collapsed ? "opacity-0 hidden" : "opacity-100")}>
//                  {item.name}
//                </span>
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Footer / Logout */}
//       <div className="p-6 relative z-10">
//         <button 
//           onClick={() => signOut({ callbackUrl: '/auth/login' })}
//           className={cn(
//             "flex items-center gap-3 px-3 py-3 rounded-xl w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20 group border border-transparent hover:border-red-500/20",
//              collapsed && "justify-center"
//           )}
//         >
//           <LogOut size={24} className="shrink-0" />
//           <span className={cn("whitespace-nowrap transition-opacity", collapsed ? "opacity-0 hidden" : "opacity-100")}>
//             Sign Out
//           </span>
//         </button>
        
//         {/* Bottom Eco Badge */}
//         {!collapsed && (
//           <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-sm">
//             <div className="flex items-center gap-2 text-emerald-400/80 text-xs">
//               <Leaf className="w-3 h-3" />
//               <span>Powered by sustainable AI</span>
//             </div>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Lightbulb, 
  MessageSquare, 
  PlusCircle, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Leaf
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';



const MENU_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Suggestions', href: '/suggestions', icon: Lightbulb },
  { name: 'Ask About Project', href: '/ask', icon: MessageSquare },
  { name: 'Connect Project', href: '/connect', icon: PlusCircle },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Auto collapse on mobile
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, []);

  return (
    <aside 
      className={cn(
        "h-screen bg-[#0a0f1c] shadow-[4px_0_30px_rgba(0,0,0,0.3)] transition-all duration-500 ease-in-out flex flex-col relative z-50 overflow-hidden",
        collapsed ? "w-20" : "w-64"
      )}
      style={{
        boxShadow: '4px 0 40px rgba(16, 185, 129, 0.15), inset -1px 0 20px rgba(16, 185, 129, 0.05)'
      }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Emerald Glow Orbs */}
        <div className="absolute top-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 -right-10 w-32 h-32 bg-emerald-400/8 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Climbing Vine Border Decoration */}
      <div className="absolute right-0 top-0 bottom-0 w-1 pointer-events-none z-20">
        {/* Main vine stem */}
        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500/30 via-emerald-400/20 to-emerald-500/30"></div>
        
        {/* Vine leaves scattered along the border */}
        {[...Array(15)].map((_, i) => {
          const topPosition = (i * 6.5) + (i % 2 === 0 ? 2 : 5);
          const rotation = i % 2 === 0 ? -25 : 25;
          const delay = i * 0.3;
          const offsetX = i % 2 === 0 ? -8 : -4;
          
          return (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${topPosition}%`,
                right: `${offsetX}px`,
                animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${delay}s`
              }}
            >
              <Leaf 
                size={12 + (i % 3) * 2} 
                className="text-emerald-500/40 drop-shadow-[0_0_4px_rgba(16,185,129,0.4)]"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  filter: 'drop-shadow(0 0 3px rgba(16, 185, 129, 0.3))'
                }}
              />
            </div>
          );
        })}

        {/* Additional small tendrils */}
        {[...Array(8)].map((_, i) => {
          const topPosition = (i * 12) + 8;
          const isCurveLeft = i % 2 === 0;
          
          return (
            <svg
              key={`tendril-${i}`}
              className="absolute"
              style={{
                top: `${topPosition}%`,
                right: isCurveLeft ? '-6px' : '-4px',
                width: '12px',
                height: '20px',
                opacity: 0.3,
                animation: `sway ${2 + (i % 2)}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`
              }}
            >
              <path
                d={isCurveLeft 
                  ? "M 10 0 Q 2 8, 10 16" 
                  : "M 2 0 Q 10 8, 2 16"
                }
                stroke="rgba(16, 185, 129, 0.4)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          );
        })}
      </div>

      {/* Additional top corner vine accent */}
      <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none z-20">
        <svg width="100%" height="100%" className="opacity-30">
          <path
            d="M 96 0 Q 90 10, 80 15 Q 70 20, 60 25 Q 50 30, 45 40"
            stroke="rgba(16, 185, 129, 0.4)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <Leaf 
          size={14} 
          className="absolute top-2 right-2 text-emerald-500/50 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)] animate-pulse"
          style={{ transform: 'rotate(-35deg)' }}
        />
        <Leaf 
          size={10} 
          className="absolute top-8 right-6 text-emerald-500/40 drop-shadow-[0_0_4px_rgba(16,185,129,0.4)]"
          style={{ transform: 'rotate(15deg)' }}
        />
      </div>

      {/* Bottom corner vine accent */}
      <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none z-20">
        <svg width="100%" height="100%" className="opacity-30">
          <path
            d="M 96 96 Q 85 85, 75 75 Q 65 65, 50 60"
            stroke="rgba(16, 185, 129, 0.4)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <Leaf 
          size={12} 
          className="absolute bottom-2 right-4 text-emerald-500/45 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)] animate-pulse"
          style={{ 
            transform: 'rotate(25deg)',
            animationDelay: '0.5s'
          }}
        />
      </div>

      {/* Header */}
      <div className="p-6 flex items-center justify-between h-20 relative z-10">
        <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-500", collapsed && "justify-center w-full")}>
           <div className="relative">
             <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-md animate-pulse"></div>
             <Leaf className="w-8 h-8 text-eco-green shrink-0 relative" />
           </div>
           <span className={cn("text-xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent whitespace-nowrap transition-opacity", collapsed ? "opacity-0 hidden" : "opacity-100")}>
             EcoGenAI
           </span>
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-24 bg-[#0a0f1c] border border-emerald-500/30 text-gray-400 rounded-full p-1.5 shadow-lg shadow-emerald-900/20 hover:text-eco-green hover:scale-110 hover:border-emerald-400/50 transition-all duration-300 transform z-50"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav Items */}
      <nav className="flex-1 py-6 px-2 space-y-2 relative z-10">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-emerald-500/10 text-eco-green shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-500/20" 
                  : "text-gray-400 hover:bg-emerald-500/5 hover:text-gray-100 hover:translate-x-1 border border-transparent hover:border-emerald-500/10"
              )}
            >
               {/* Active Indicator Line */}
               {isActive && (
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 shadow-[0_0_8px_#10b981]" />
               )}

               {/* Hover Glow Effect */}
               <div className={cn(
                 "absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                 isActive && "opacity-100"
               )}></div>

               <Icon size={24} className={cn("shrink-0 transition-transform group-hover:scale-110 relative z-10", isActive && "drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]")} />
               
               <span className={cn("whitespace-nowrap transition-opacity duration-300 relative z-10", collapsed ? "opacity-0 hidden" : "opacity-100")}>
                 {item.name}
               </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 relative z-10">
        <button 
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-xl w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 hover:shadow-lg hover:shadow-red-900/20 group border border-transparent hover:border-red-500/20",
             collapsed && "justify-center"
          )}
        >
          <LogOut size={24} className="shrink-0" />
          <span className={cn("whitespace-nowrap transition-opacity", collapsed ? "opacity-0 hidden" : "opacity-100")}>
            Sign Out
          </span>
        </button>
        
        {/* Bottom Eco Badge */}
        {!collapsed && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-400/80 text-xs">
              <Leaf className="w-3 h-3" />
              <span>Powered by sustainable AI</span>
            </div>
          </div>
        )}
      </div>

      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes sway {
          0%, 100% {
            transform: translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateX(2px) rotate(5deg);
          }
        }
      `}</style>
    </aside>
  );
}