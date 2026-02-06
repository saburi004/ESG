

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative overflow-hidden bg-navy-900">
      <main className="h-full relative overflow-y-auto">
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
