'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldAlert, Lock, User, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ApplicationsLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both your admin username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed.');
        setLoading(false);
        return;
      }

      window.location.href = data.redirectUrl || '/applications/dashboard';
    } catch (err) {
      setError('An error occurred during sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0] flex flex-col justify-between font-sans">
      <div>
        {/* Top Header Bar */}
        <header className="bg-[#284b85] text-white shadow-md sticky top-0 z-50">
          <div className="text-slate-200 text-xs py-1.5 px-4 md:px-8 flex justify-between items-center border-b border-blue-900/40">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" /> Secure Admin Access
              </span>
              <span className="hidden sm:inline text-slate-400">|</span>
              <span className="hidden sm:inline">School ID#: 8284465</span>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Golden Glades Middle Logo"
                width={50}
                height={50}
                className="w-12 h-12 object-contain drop-shadow-md"
                priority
              />
              <div>
                <h1 className="text-base font-bold leading-tight">Golden Glades Middle School</h1>
                <p className="text-xs text-amber-300 font-medium">Submitted Applications Portal</p>
              </div>
            </div>

            <Link 
              href="/AdminPortal" 
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-amber-300 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Portal
            </Link>
          </div>
        </header>

        {/* Lime Green Banner */}
        <div className="bg-[#32cd32] text-slate-900 py-3.5 px-6 text-center shadow-inner">
          <h2 className="text-lg md:text-xl font-extrabold tracking-wide">
            Submitted Applications Portal
          </h2>
        </div>

        {/* Main Login Workspace */}
        <main className="max-w-md mx-auto px-4 py-12">
          <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 text-[#0a3161] rounded-full flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Administrator Login</h3>
              <p className="text-xs text-slate-500">
                Enter your administrative credentials to view submitted applicant records.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Admin Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-300 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0a3161] hover:bg-[#284b85] text-white text-xs font-bold py-2.5 rounded-lg transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                {loading ? 'Signing In...' : 'Sign In to Review Applications'}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400">
                Authorized Personnel Only
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white text-xs font-semibold py-3.5 px-4 md:px-8 border-t-2 border-amber-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-y-2 gap-x-6 text-center">
          <a href="#" className="hover:text-amber-400 transition">Partnerships</a>
          <a href="#" className="hover:text-amber-400 transition">Calendars</a>
          <Link href="/careers" className="hover:text-amber-400 transition">Careers</Link>
          <a href="#" className="hover:text-amber-400 transition">Directory</a>
          <a href="#" className="hover:text-amber-400 transition">School</a>
          <Link href="/director" className="hover:text-amber-400 transition">Director</Link>
        </div>
      </footer>
    </div>
  );
}
