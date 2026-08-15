'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldAlert, User, Search, Menu, X, ChevronDown, Briefcase, GraduationCap, ExternalLink } from 'lucide-react';

export default function CareersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Replace these URLs with your actual form links (Google Forms, Roblox Forms, Tally, etc.)
  const STAFF_FORM_URL = "https://forms.google.com/your-staff-form-link";
  const COUNSELOR_FORM_URL = "https://forms.google.com/your-counselor-form-link";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Top Utility Bar */}
      <div className="bg-[#1a3861] text-slate-200 text-xs py-1.5 px-4 md:px-8 flex justify-between items-center border-b border-blue-900/40">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" /> Emergency Alerts: Active
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline">School ID#: 8284465</span>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/api/auth/roblox" className="text-amber-400 font-semibold hover:underline flex items-center gap-1">
            <User className="w-3.5 h-3.5" /> Log In
          </a>
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
      <section className="bg-gradient-to-r from-[#284b85] to-[#1a3861] text-white py-14 px-4 md:px-8 border-b-4 border-amber-400">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-amber-400/30">
            Join Our Team
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Golden Glades Middle Careers</h1>
          <p className="text-amber-300 italic text-sm md:text-base font-serif">Explore available opportunities and apply to join our dedicated staff.</p>
        </div>
      </section>

      {/* Sub-Navigation Bar */}
      <div className="bg-black text-white text-xs font-semibold py-3 px-4 md:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-y-2 gap-x-6 text-center">
          <a href="#" className="hover:text-amber-400 transition">Partnerships</a>
          <a href="#" className="hover:text-amber-400 transition">Calendars</a>
          <Link href="/careers" className="text-amber-400 transition font-bold">Careers</Link>
          <a href="#" className="hover:text-amber-400 transition">Directory</a>
          <a href="#" className="hover:text-amber-400 transition">School</a>
          <a href="#" className="hover:text-amber-400 transition">Director</a>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 flex-grow w-full space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-[#1a3861]">Open Applications</h2>
          <p className="text-slate-600 text-sm">Select an application below to open the submission form.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Staff Application Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden">
            <div className="p-8 space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-[#284b85] rounded-xl flex items-center justify-center border border-blue-100">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Staff Application</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Apply for general staff roles including Teachers, Substitute Teachers, Teaching Aides, Security personnel, Office Secretaries, and Nurses.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">✓ Minimum 3 days weekday availability required</li>
                <li className="flex items-center gap-2">✓ Roleplay & Grammar evaluation included</li>
              </ul>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <a 
                href={STAFF_FORM_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-[#284b85] hover:bg-[#1a3861] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                Open Staff Application Form <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Guidance Counselor Application Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden">
            <div className="p-8 space-y-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center border border-amber-100">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Guidance Counselor Application</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Apply to serve as a School Counselor to support student wellbeing, resolve conflicts, and guide academic development.
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">✓ Requires strong communication & empathy</li>
                <li className="flex items-center gap-2">✓ Scenario-based conflict resolution assessment</li>
              </ul>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100">
              <a 
                href={COUNSELOR_FORM_URL} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-[#284b85] hover:bg-[#1a3861] text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
              >
                Open Counselor Application Form <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#1a3861] text-slate-400 text-xs py-8 px-4 md:px-8 border-t border-blue-900">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p>© {new Date().getFullYear()} Golden Glades Middle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
