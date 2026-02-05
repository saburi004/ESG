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
        "h-screen bg-navy-900 border-r border-navy-700 transition-all duration-300 flex flex-col relative z-50",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-navy-700 h-16">
        <div className={cn("flex items-center gap-3 overflow-hidden transition-all", collapsed && "justify-center w-full")}>
           <Leaf className="w-8 h-8 text-eco-green shrink-0 animate-pulse-slow" />
           <span className={cn("text-xl font-bold text-white whitespace-nowrap transition-opacity", collapsed ? "opacity-0 hidden" : "opacity-100")}>
             EcoGenAI
           </span>
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-navy-700 border border-navy-600 text-gray-300 rounded-full p-1 hover:text-eco-green hover:border-eco-green transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Nav Items */}
      <nav className="flex-1 py-6 px-2 space-y-2">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative overflow-hidden",
                isActive 
                  ? "bg-eco-green/10 text-eco-green shadow-[0_0_10px_rgba(0,255,136,0.1)]" 
                  : "text-gray-400 hover:bg-navy-800 hover:text-gray-100"
              )}
            >
               {/* Active Indicator Line */}
               {isActive && (
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-eco-green shadow-[0_0_8px_#00ff88]" />
               )}

               <Icon size={24} className={cn("shrink-0 transition-transform group-hover:scale-110", isActive && "animate-pulse")} />
               
               <span className={cn("whitespace-nowrap transition-opacity duration-300", collapsed ? "opacity-0 hidden" : "opacity-100")}>
                 {item.name}
               </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-navy-700">
        <button 
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-xl w-full text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all",
             collapsed && "justify-center"
          )}
        >
          <LogOut size={24} />
          <span className={cn("whitespace-nowrap transition-opacity", collapsed ? "opacity-0 hidden" : "opacity-100")}>
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
