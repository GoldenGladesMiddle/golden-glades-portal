'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldAlert, 
  User, 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  ArrowRight, 
  BookOpen, 
  Calendar, 
  Bell, 
  UserCheck 
} from 'lucide-react';

export default function HomePage() {
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
          <div className="flex items-center space-x-4">
            <a href="/api/auth/roblox" className="text-amber-400 font-semibold hover:underline flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Log In
            </a>
          </div>
        </div>

        {/* Header / Main Navigation */}
        <header className="bg-[#284b85] text-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-2 flex items-center justify-between">
            <button className="md:hidden text-white focus:outline-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#" className="hover:text-amber-300 transition">Admissions</a>
              <a href="#" className="hover:text-amber-300 transition">Resources</a>
              <a href="#" className="hover:text-amber-300 transition">Schools</a>
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
              <Link href="/" className="block text-amber-300 font-bold">Home</Link>
              <Link href="/careers" className="block text-slate-100 hover:text-amber-300">Careers</Link>
              <a href="/api/auth/roblox" className="block text-slate-100 hover:text-amber-300 font-bold">Portal</a>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="bg-[#284b85] text-white py-16 px-4 md:px-8 border-b-4 border-amber-400 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">GOLDEN GLADES MIDDLE</h1>
            <p className="text-slate-200 text-lg md:text-xl font-light">Your Best Choice for Middle School Education</p>
            <div className="pt-4 max-w-xl mx-auto relative">
              <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search services, staff, or documents..." 
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm shadow-inner"
              />
            </div>
          </div>
        </section>

        {/* Main Dashboard Features Section */}
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">STUDENT Dashboard Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-blue-50 text-[#284b85] rounded-xl flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Student Portal</h3>
                <p className="text-xs text-slate-500 leading-relaxed">View grades, attendance, and class schedules.</p>
              </div>
              <Link href="/StudentPortal" className="mt-6 text-xs font-bold text-[#284b85] hover:text-amber-600 flex items-center gap-1">
                Access Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-blue-50 text-[#284b85] rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Class Schedules</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Check period timings and room assignments.</p>
              </div>
              <a href="#" className="mt-6 text-xs font-bold text-[#284b85] hover:text-amber-600 flex items-center gap-1">
                Access Now <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-blue-50 text-[#284b85] rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">District Calendar</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Holidays, exam schedules, and event dates.</p>
              </div>
              <a href="#" className="mt-6 text-xs font-bold text-[#284b85] hover:text-amber-600 flex items-center gap-1">
                Access Now <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-blue-50 text-[#284b85] rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Announcements</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Latest updates from school administration.</p>
              </div>
              <a href="#" className="mt-6 text-xs font-bold text-[#284b85] hover:text-amber-600 flex items-center gap-1">
                Access Now <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
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
            <Link href="/careers" className="hover:text-amber-400 transition">Careers</Link>
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
