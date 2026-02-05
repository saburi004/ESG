import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-navy-900 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-0 relative">
        {/* Background Gradients for the whole dashboard area */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-eco-green/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-900/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
             {children}
        </div>
      </main>
    </div>
  );
}
