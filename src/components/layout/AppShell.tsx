'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define routes where Sidebar should be HIDDEN
  const isPublicPage = pathname === '/' || pathname.startsWith('/auth');

  if (isPublicPage) {
    // Return children directly (Full Page Layout)
    return <>{children}</>;
  }

  // Authenticated/Dashboard Layout
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative bg-navy-900">
        {children}
      </main>
    </div>
  );
}
