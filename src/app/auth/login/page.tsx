
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roomId, setRoomId] = useState(''); // New state for Room ID
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await signIn('credentials', {
        email,
        password,
        roomId: roomId || undefined, // Pass roomId if it exists
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid credentials');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] grid-rows-[repeat(auto-fill,minmax(60px,1fr))]">
        {Array.from({ length: 800 }).map((_, i) => (
          <div key={i} className="border border-white/5 bg-transparent hover:bg-emerald-500/50 transition-colors duration-50" />
        ))}
      </div>

       {/* 🌿 CENTER EMERALD GLOW */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-emerald-500 blur-[120px] opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-zinc-900/90 backdrop-blur-xl border border-emerald-500/20 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.15)]">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Welcome Back
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
                Sign in to your EcoGenAI dashboard
            </p>
        </div>

        {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-600"
                    placeholder="you@example.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-600"
                    placeholder="••••••••"
                />
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-300 mb-1">Room ID (Optional)</label>
                 <input 
                     type="text" 
                     value={roomId}
                     onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                     className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-gray-600"
                     placeholder="XR72B9"
                 />
             </div>

            <button 
                type="submit"
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transform hover:scale-[1.02]"
            >
                Access Dashboard
            </button>
        </form>

        <div className="mt-6 text-center">
            <Link href="/auth/signup" className="text-sm text-gray-400 hover:text-white transition-colors">
                Don't have an account? <span className="text-emerald-500 hover:underline">Sign up</span>
            </Link>
        </div>
      </div>
    </div>
  );
}