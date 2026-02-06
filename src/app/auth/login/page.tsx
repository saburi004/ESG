// 'use client';

// import { useState } from 'react';
// import { signIn } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Leaf } from 'lucide-react';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const res = await signIn('credentials', {
//         email,
//         password,
//         redirect: false,
//       });

//       if (res?.error) {
//         setError('Invalid credentials');
//         return;
//       }

//       router.push('/dashboard');
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-navy-900 relative overflow-hidden">
//       {/* Background Ambience */}
//       <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
//          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-eco-green/10 rounded-full blur-3xl animate-pulse-slow"></div>
//          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-eco-light/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
//       </div>

//       <div className="bg-navy-800 p-8 rounded-2xl shadow-2xl border border-navy-700 w-full max-w-md z-10">
//         <div className="flex justify-center mb-6">
//           <div className="bg-navy-900 p-3 rounded-full border border-eco-green/30 shadow-[0_0_15px_rgba(0,255,136,0.3)]">
//             <Leaf className="w-8 h-8 text-eco-green" />
//           </div>
//         </div>
        
//         <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
//         <p className="text-gray-400 text-center mb-8">Sign in to your EcoGenAI Cockpit</p>

//         {error && (
//           <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eco-green focus:ring-1 focus:ring-eco-green transition-colors"
//               placeholder="you@example.com"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full bg-navy-900 border border-navy-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eco-green focus:ring-1 focus:ring-eco-green transition-colors"
//               placeholder="••••••••"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-eco-green text-navy-900 font-bold py-3 rounded-lg hover:bg-eco-light transition-all transform hover:scale-[1.02] shadow-[0_0_20px_rgba(0,255,136,0.3)]"
//           >
//             Access Dashboard
//           </button>
//         </form>

//         <p className="mt-6 text-center text-gray-400 text-sm">
//           Don't have an account?{' '}
//           <Link href="/auth/signup" className="text-eco-green hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import { useState } from 'react';
// import { signIn } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Leaf } from 'lucide-react';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     try {
//       const res = await signIn('credentials', {
//         email,
//         password,
//         redirect: false,
//       });

//       if (res?.error) {
//         setError('Invalid credentials');
//         return;
//       }

//       router.push('/dashboard');
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1c] via-[#0d1425] to-[#0a0f1c] relative overflow-hidden">
//       {/* Animated Background Grid */}
//       <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
//       {/* Glowing Orbs */}
//       <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
//       <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl"></div>

//       {/* Falling Leaves Animation */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(15)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute text-emerald-500/30"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `-20px`,
//               animation: `fall ${10 + Math.random() * 10}s linear infinite`,
//               animationDelay: `${Math.random() * 5}s`,
//               fontSize: `${12 + Math.random() * 8}px`,
//             }}
//           >
//             🍃
//           </div>
//         ))}
//       </div>

//       {/* Tree in Bottom Right Corner */}
//       <div className="absolute bottom-0 right-0 pointer-events-none opacity-20">
//         <svg width="300" height="400" viewBox="0 0 300 400" fill="none">
//           {/* Tree Trunk */}
//           <rect x="130" y="280" width="40" height="120" fill="#10b981" opacity="0.6"/>
          
//           {/* Tree Foliage - Layered Circles */}
//           <circle cx="150" cy="280" r="80" fill="#10b981" opacity="0.3"/>
//           <circle cx="120" cy="250" r="60" fill="#10b981" opacity="0.4"/>
//           <circle cx="180" cy="250" r="60" fill="#10b981" opacity="0.4"/>
//           <circle cx="150" cy="220" r="70" fill="#10b981" opacity="0.5"/>
//           <circle cx="130" cy="200" r="50" fill="#34d399" opacity="0.5"/>
//           <circle cx="170" cy="200" r="50" fill="#34d399" opacity="0.5"/>
//           <circle cx="150" cy="180" r="55" fill="#6ee7b7" opacity="0.6"/>
//         </svg>
//       </div>

//       {/* Main Form Container */}
//       <div className="relative z-10 w-full max-w-md px-6">
//         <div className="bg-[#0a0f1c]/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-emerald-500/30 relative overflow-hidden"
//              style={{
//                boxShadow: '0 0 60px rgba(16, 185, 129, 0.15), inset 0 0 60px rgba(16, 185, 129, 0.05)'
//              }}>
          
//           {/* Inner Glow Effect */}
//           <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl"></div>
          
//           {/* Logo Section */}
//           <div className="flex justify-center mb-8 relative">
//             <div className="relative">
//               <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl animate-pulse"></div>
//               <div className="relative bg-gradient-to-br from-[#0a0f1c] to-[#0d1425] p-4 rounded-2xl border border-emerald-500/40 shadow-lg">
//                 <Leaf className="w-10 h-10 text-emerald-400" strokeWidth={2.5} />
//               </div>
//             </div>
//           </div>
          
//           <div className="text-center mb-8 relative">
//             <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 bg-clip-text text-transparent mb-3">
//               Welcome Back
//             </h2>
//             <p className="text-slate-400 text-base">Sign in to your EcoGenAI Cockpit</p>
//           </div>

//           {error && (
//             <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/40 text-red-400 p-4 rounded-xl mb-6 text-sm text-center">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-5 relative">
//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-emerald-400/90 mb-2">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full bg-[#0a0f1c]/80 border border-emerald-500/30 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 transition-all duration-300 backdrop-blur-sm"
//                 placeholder="you@example.com"
//                 required
//               />
//             </div>
            
//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-emerald-400/90 mb-2">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full bg-[#0a0f1c]/80 border border-emerald-500/30 rounded-xl px-5 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40 transition-all duration-300 backdrop-blur-sm"
//                 placeholder="••••••••"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] shadow-lg mt-8 relative overflow-hidden group"
//             >
//               <span className="relative z-10">Access Dashboard</span>
//               <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//             </button>
//           </form>

//           <p className="mt-8 text-center text-slate-400 text-sm relative">
//             Don't have an account?{' '}
//             <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200">
//               Sign up
//             </Link>
//           </p>
//         </div>

//         {/* Bottom Accent */}
//         <div className="mt-6 text-center">
//           <p className="text-slate-500 text-xs flex items-center justify-center gap-2">
//             <Leaf className="w-3 h-3 text-emerald-500" />
//             Powering sustainable AI solutions
//           </p>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fall {
//           0% {
//             transform: translateY(-20px) rotate(0deg);
//             opacity: 1;
//           }
//           100% {
//             transform: translateY(100vh) rotate(360deg);
//             opacity: 0.3;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* 🔳 INTERACTIVE TILE GRID BACKGROUND */}
      <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] grid-rows-[repeat(auto-fill,minmax(60px,1fr))]">
        {Array.from({ length: 800 }).map((_, i) => (
          <div
            key={i}
            className="
              border border-white/5
              bg-transparent
              transition-all duration-200 ease-out
              hover:bg-emerald-500/70
              hover:border-emerald-400/80
              hover:shadow-[0_0_18px_rgba(16,185,129,0.9)]
            "
          />
        ))}
      </div>

      {/* 🌿 CENTER EMERALD GLOW */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[420px] h-[420px] rounded-full bg-emerald-500 blur-[90px] opacity-60" />
      </div>

      {/* 🪟 LOGIN CARD */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div
          className="
            w-full max-w-md rounded-2xl p-8
            bg-gradient-to-br from-zinc-900/90 to-zinc-800/80
            backdrop-blur-xl
            border border-white/10
            shadow-[0_0_60px_rgba(16,185,129,0.18)]
          "
        >
          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2">
              Sign in to your EcoGenAI dashboard
            </p>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 text-sm text-gray-300 font-medium">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="
                  w-full rounded-lg px-4 py-3
                  bg-zinc-900 border border-zinc-700
                  text-white placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-emerald-500
                "
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-gray-300 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="
                  w-full rounded-lg px-4 py-3
                  bg-zinc-900 border border-zinc-700
                  text-white placeholder-gray-500
                  focus:outline-none focus:ring-2 focus:ring-emerald-500
                "
                required
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="
                relative w-full overflow-hidden rounded-lg
                bg-emerald-500 py-3 font-semibold text-black
                transition-all duration-300
                hover:scale-[1.02]
                hover:shadow-[0_0_25px_rgba(16,185,129,0.8)]
                active:scale-95
              "
            >
              <span className="relative z-10">Access Dashboard</span>
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 hover:opacity-100 transition-opacity" />
            </button>
          </form>

          {/* FOOTER */}
          <p className="mt-6 text-center text-gray-400 text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-emerald-400 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}