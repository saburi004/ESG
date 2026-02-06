'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Copy, Check } from 'lucide-react';

export default function CreateRoomPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successRoomId, setSuccessRoomId] = useState('');
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/room/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Something went wrong');
        return;
      }

      setSuccessRoomId(data.roomId);
    } catch (err) {
        console.error(err);
      setError('Failed to create room');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(successRoomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (successRoomId) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
             {/* Background */}
            <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] grid-rows-[repeat(auto-fill,minmax(60px,1fr))] opacity-20">
                {Array.from({ length: 800 }).map((_, i) => (
                <div key={i} className="border border-white/5 bg-transparent" />
                ))}
            </div>

            <div className="relative z-10 max-w-md w-full p-8 bg-zinc-900/90 border border-emerald-500/50 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)] text-center">
                <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent mb-4">
                    Room Created!
                </h2>
                <p className="text-gray-400 mb-6">
                    Your organization room is ready. Share this Room ID with your team members.
                </p>

                <div className="bg-black/50 border border-white/10 rounded-xl p-4 mb-8 flex items-center justify-between group">
                    <span className="text-2xl font-mono tracking-widest text-emerald-400 font-bold">
                        {successRoomId}
                    </span>
                    <button 
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Copy Room ID"
                    >
                        {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-gray-400 group-hover:text-white" />}
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    <Link 
                        href="/auth/login" 
                        className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    >
                        Go to Login
                    </Link>
                    <p className="text-sm text-gray-500 mt-2">
                        Admin account created for {email}
                    </p>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] grid-rows-[repeat(auto-fill,minmax(60px,1fr))]">
        {Array.from({ length: 800 }).map((_, i) => (
          <div key={i} className="border border-white/5 bg-transparent hover:bg-emerald-500/60 transition-colors duration-50" />
        ))}
      </div>
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-emerald-500 blur-[120px] opacity-60" />
      </div>


      <div className="relative z-10 w-full max-w-md p-8 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Create Organization Room
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
                Set up a centralized workspace for your team's ESG analytics.
            </p>
        </div>

        {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-lg text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Organization Name</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    placeholder="Acme Corp"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Admin Email</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    placeholder="admin@acme.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                    placeholder="••••••••"
                />
            </div>

            <button 
                type="submit"
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
                Create Room
            </button>
        </form>

        <div className="mt-6 text-center">
            <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                Already have a room? Login
            </Link>
        </div>
      </div>
    </div>
  );
}
