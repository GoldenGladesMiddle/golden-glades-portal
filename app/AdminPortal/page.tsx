'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldAlert, 
  BookOpen, 
  FileCheck, 
  Search,
  ChevronDown,
  LogOut
} from 'lucide-react';

export default function AdminPortalPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-[#f8f6f0] flex flex-col justify-between font-sans">
      <div>
        {/* 1. Top Navigation Bar (#284b85 - Original Blue) */}
        <header className="bg-[#284b85] text-white shadow-md sticky top-0 z-50">
          {/* Top Utility Row */}
          <div className="text-slate-200 text-xs py-1.5 px-4 md:px-8 flex justify-between items-center border-b border-blue-900/40">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" /> Emergency Alerts: Active
              </span>
              <span className="hidden sm:inline text-slate-400">|</span>
              <span className="hidden sm:inline">School ID#: 8284465</span>
            </div>
          </div>

          {/* Main Header Links Row */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between">
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#" className="hover:text-amber-300 transition">Admissions</a>
              <a href="#" className="hover:text-amber-300 transition">Resources</a>
              <a href="#" className="hover:text-amber-300 transition">Schools</a>
            </nav>

            <div className="flex items-center justify-center py-1">
              <Link href="/" className="transform hover:scale-105 transition block">
                <Image
                  src="/logo.png"
                  alt="Golden Glades Middle Logo"
                  width={60}
                  height={60}
                  className="w-14 h-14 object-contain drop-shadow-md"
                  priority
                />
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#" className="hover:text-amber-300 transition">News</a>
              <Link href="/AdminPortal" className="text-amber-300 font-semibold transition">Portal</Link>
              <div className="flex items-center space-x-1 cursor-pointer hover:text-amber-300 transition text-xs font-semibold">
                <span>English</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
              <button className="hover:text-amber-300 transition focus:outline-none">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* 2. Main Portal Workspace */}
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-140px)]">
          {/* Left Sidebar (#0a3161 - Original Blue) */}
          <aside className="w-full md:w-64 bg-[#0a3161] text-white flex flex-col justify-between p-6 shrink-0">
            <div className="space-y-8">
              {/* User Profile */}
              <div className="flex items-center space-x-3 pb-6 border-b border-blue-800/60">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm overflow-hidden text-center leading-tight p-1">
                  ADMIN
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">ADMIN USER</h3>
                  <p className="text-xs text-blue-300">@Administrator</p>
                  <p className="text-[10px] text-blue-300/80 font-mono mt-0.5">
                    User ID: <span className="text-cyan-400 font-semibold">000001</span>
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-4 text-sm font-semibold">
                <Link 
                  href="/AdminPortal/gradebook" 
                  className="flex items-center space-x-3 text-white hover:text-amber-300 transition py-1"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Gradebook</span>
                </Link>

                <Link 
                  href="/AdminPortal/submitted-applications" 
                  className="flex items-center space-x-3 text-white hover:text-amber-300 transition py-1"
                >
                  <FileCheck className="w-4 h-4 text-amber-400" />
                  <span>Submitted Applications</span>
                </Link>
              </nav>
            </div>

            {/* Sign Out Button */}
            <div className="pt-6 border-t border-blue-800/60 mt-auto">
              <a
                href="/api/auth/logout"
                className="flex items-center space-x-3 text-sm font-semibold text-rose-300 hover:text-rose-100 transition py-1"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out</span>
              </a>
            </div>
          </aside>

          {/* Right Main Content Panel */}
          <main className="flex-1 flex flex-col">
            {/* Centered Lime Green Banner */}
            <div className="bg-[#32cd32] text-slate-900 py-4 px-6 text-center shadow-inner">
              <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">
                Welcome to Golden Glades Middle Admin Portal
              </h1>
            </div>

            {/* Main Dashboard Content */}
            <div className="p-6 md:p-12 space-y-12 max-w-6xl mx-auto w-full">
              {/* Support & SGA Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Student Government Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80 space-y-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Student Government
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Get Involved! DSGA provides information on how students can participate, contact their school&apos;s SGA sponsor, and voice their concerns.
                  </p>
                  <div>
                    <button className="px-4 py-1.5 text-xs font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition">
                      Learn More
                    </button>
                  </div>
                </div>

                {/* Child Abuse Hotline Card */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200/80 space-y-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    Child Abuse Hotline &amp; Support
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    To report abuse or seek support, please contact the helpline below: <br />
                    <span className="font-semibold text-slate-800">Telephone: 800-962-2873</span>
                  </p>
                  <div>
                    <button className="px-4 py-1.5 text-xs font-semibold text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition">
                      Report Abuse
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Section */}
              <div className="text-center space-y-4 max-w-xl mx-auto pt-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Stay Connected. Stay Ahead.
                  </h2>
                  <p className="text-xs text-slate-500">
                    Find all the administrative tools and resources you need
                  </p>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search admin Apps..."
                    className="w-full bg-white border border-slate-300 rounded-lg py-2.5 pl-11 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* 3. Black Footer Sub-Bar */}
      <footer className="bg-black text-white text-xs font-semibold py-3.5 px-4 md:px-8 border-t-2 border-amber-400 z-50">
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
