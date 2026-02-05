import { Construction, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ConnectPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="bg-navy-800 p-8 rounded-full border border-navy-700 shadow-2xl relative">
         <div className="absolute inset-0 bg-eco-green/20 rounded-full blur-xl animate-pulse-slow"></div>
         <Construction size={64} className="text-eco-green relative z-10" />
      </div>
      
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Connect New Project</h1>
        <p className="text-gray-400 max-w-md mx-auto">
          We are currently building the integrations for AWS, GCP, and Azure. 
          Expect this feature in Q3 2026.
        </p>
      </div>

      <div className="bg-navy-800/50 border border-navy-700 p-4 rounded-xl max-w-sm">
        <p className="text-xs text-eco-green font-mono">STATUS: DEVELOPMENT_IN_PROGRESS</p>
      </div>

      <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 hover:underline">
         <ArrowLeft size={16} /> Back to Dashboard
      </Link>
    </div>
  );
}
