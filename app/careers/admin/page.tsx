'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldAlert, Search, Menu, X, ChevronDown } from 'lucide-react';

export default function AdminApplicationPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <div>
        {/* Top Utility Bar */}
        <div className="bg-[#1a3861] text-slate-200 text-xs py-1.5 px-4 md:px-8 flex justify-between items-center border-b border-blue-900/40">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" /> Emergency Alerts: Active
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline">School ID#: 8284465</span>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <header className="bg-[#284b85] text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between">
            <button className="md:hidden text-white focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <Link href="/" className="hover:text-amber-300 transition">Home</Link>
              <a href="#" className="hover:text-amber-300 transition">Admissions</a>
              <a href="#" className="hover:text-amber-300 transition">Resources</a>
            </nav>
            <div className="flex items-center justify-center py-1">
              <Link href="/" className="transform hover:scale-105 transition block">
                <Image src="/logo.png" alt="Golden Glades Middle Logo" width={80} height={80} className="w-20 h-20 object-contain drop-shadow-md" priority />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#" className="hover:text-amber-300 transition">News</a>
              <a href="/api/auth/roblox" className="hover:text-amber-300 font-semibold transition">Portal</a>
              <div className="flex items-center space-x-1 cursor-pointer hover:text-amber-300 transition text-xs font-semibold">
                <span>English</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
              <button className="hover:text-amber-300 transition focus:outline-none"><Search className="w-4 h-4" /></button>
            </div>
            <button className="md:hidden text-white focus:outline-none"><Search className="w-5 h-5" /></button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#1a3861] px-6 py-4 space-y-3 border-t border-blue-800 text-sm">
              <Link href="/" className="block text-slate-100 hover:text-amber-300">Home</Link>
              <Link href="/careers" className="block text-amber-300 font-bold">Careers</Link>
              <a href="/api/auth/roblox" className="block text-slate-100 hover:text-amber-300 font-bold">Portal</a>
            </div>
          )}
        </header>

        {/* Header Banner */}
        <section className="bg-gradient-to-r from-[#284b85] to-[#1a3861] text-white py-12 px-4 md:px-8 border-b-4 border-amber-400">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Administration Application</h1>
            <p className="text-amber-300 text-sm md:text-base">Golden Glades Middle School Leadership</p>
          </div>
        </section>

        {/* Application Form Container */}
        <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 flex-grow w-full">
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">Roblox Username</label>
                <input type="text" required placeholder="Enter your username" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">Admin Position Desired</label>
                <select required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm bg-white">
                  <option value="">Select a leadership position...</option>
                  <option value="assistant_principal">Assistant Principal</option>
                  <option value="dean_of_students">Dean of Students</option>
                  <option value="department_head">Department Head</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">How do you handle conflict resolution and staff management?</label>
                <textarea rows={4} required placeholder="Detail your leadership style and approach..." className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">Administrative & Moderation Experience</label>
                <textarea rows={4} required placeholder="List past administration or group management roles..." className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" />
              </div>

              <button type="submit" className="w-full bg-[#284b85] hover:bg-[#1a3861] text-white font-bold py-3 px-6 rounded-lg text-sm transition">
                Submit Admin Application
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* Footer Area */}
      <footer>
        {/* Sub-Navigation Black Bar */}
        <div className="bg-black text-white text-xs font-semibold py-3.5 px-4 md:px-8 border-t-2 border-amber-400">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-y-2 gap-x-6 text-center">
            <a href="#" className="hover:text-amber-400 transition">Partnerships</a>
            <a href="#" className="hover:text-amber-400 transition">Calendars</a>
            <Link href="/careers" className="text-amber-400 transition font-bold">Careers</Link>
            <a href="#" className="hover:text-amber-400 transition">Directory</a>
            <a href="#" className="hover:text-amber-400 transition">School</a>
            <a href="#" className="hover:text-amber-400 transition">Director</a>
          </div>
        </div>

        {/* Main Footer with Copyright Notice */}
        <div className="bg-[#1a3861] text-slate-300 text-xs py-8 px-4 md:px-8 border-t border-blue-900">
          <div className="max-w-7xl mx-auto text-center md:text-left">
            <p>© 2026 Golden Glades Middle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
