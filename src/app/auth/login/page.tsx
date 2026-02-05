'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await signIn('credentials', {
        email,
        password,
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
    <div className="min-h-screen flex items-center justify-center bg-navy-900 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-eco-green/10 rounded-full blur-3xl animate-pulse-slow"></div>
         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-eco-light/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="bg-navy-800 p-8 rounded-2xl shadow-2xl border border-navy-700 w-full max-w-md z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-navy-900 p-3 rounded-full border border-eco-green/30 shadow-[0_0_15px_rgba(0,255,136,0.3)]">
            <Leaf className="w-8 h-8 text-eco-green" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400 text-center mb-8">Sign in to your EcoGenAI Cockpit</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eco-green focus:ring-1 focus:ring-eco-green transition-colors"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eco-green focus:ring-1 focus:ring-eco-green transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-eco-green text-navy-900 font-bold py-3 rounded-lg hover:bg-eco-light transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(0,255,136,0.3)]"
          >
            Access Dashboard
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-eco-green hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
