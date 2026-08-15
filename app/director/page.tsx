'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldAlert, Search, Menu, X, ChevronDown } from 'lucide-react';

export default function DirectorPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col justify-between">
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
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

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
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain drop-shadow-md"
                  priority
                />
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#" className="hover:text-amber-300 transition">News</a>
              <a href="/api/auth/roblox" className="hover:text-amber-300 font-semibold transition">Portal</a>
              <div className="flex items-center space-x-1 cursor-pointer hover:text-amber-300 transition text-xs font-semibold">
                <span>English</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
              <button className="hover:text-amber-300 transition focus:outline-none">
                <Search className="w-4 h-4" />
              </button>
            </div>

            <button className="md:hidden text-white focus:outline-none">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#1a3861] px-6 py-4 space-y-3 border-t border-blue-800 text-sm">
              <a href="#" className="block text-slate-100 hover:text-amber-300">Admissions</a>
              <a href="#" className="block text-slate-100 hover:text-amber-300">Resources</a>
              <a href="#" className="block text-slate-100 hover:text-amber-300">Schools</a>
              <a href="#" className="block text-slate-100 hover:text-amber-300">News</a>
              <Link href="/careers" className="block text-amber-300 font-bold">Careers</Link>
              <a href="/api/auth/roblox" className="block text-slate-100 hover:text-amber-300 font-bold">Portal</a>
            </div>
          )}
        </header>

        {/* Banner Heading */}
        <div className="bg-[#0f2038] text-white text-center py-6 shadow-sm border-b-4 border-amber-400">
          <h1 className="text-3xl md:text-5xl font-black tracking-wider uppercase">
            Director&apos;s Message
          </h1>
        </div>

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
            
            {/* Left Column: Image, Name & Title */}
            <div className="md:col-span-5 flex flex-col items-start space-y-4">
              <div className="w-full relative aspect-[4/3] bg-slate-200 overflow-hidden shadow-sm">
                <Image
                  src="/director-photo.png"
                  alt="Kel Jordan - Director at Golden Glades Middle"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              <div className="pt-2">
                <h2 className="text-2xl md:text-3xl font-light text-slate-900 tracking-wide uppercase">
                  KEL JORDAN
                </h2>
                <p className="text-sm text-slate-600 mt-1 font-normal">
                  Director at Golden Glades Middle
                </p>
              </div>
            </div>

            {/* Right Column: Letter Text */}
            <div className="md:col-span-7 space-y-5 text-slate-700 text-base leading-relaxed">
              <p>Dear GGM Community,</p>

              <p>
                It is with great excitement and gratitude that I introduce myself as the School Director at Golden Glades Middle. I am truly honored to lead a vibrant and diverse community, where every voice shall be valued and heard and every achievement, big or small, is celebrated.
              </p>

              <p>
                Our school&apos;s motto, <strong className="font-bold text-slate-900">&quot;Where Future Leaders Strive&quot;</strong>, serves as our daily call to action. It is a powerful reminder that education is not just about what we learn in the classrooms but about how we grow, challenge ourselves, and prepare to impact the world around us. Whether through rigorous inquiries in Science and History, creative expression in Drama and Art, or practical skill-building in our Cooking and Gym classes, we are committed to helping every student from 5th to 8th grade and our SPED program to take the next step in their leadership journey.
              </p>

              <p>
                At Golden Glades Middle, I believe in nurturing our students academically, socially, and emotionally. My vision is to build on our strong foundation by fostering a safe, inclusive, and inspiring environment where students are empowered to reach their fullest potential. Together with our dedicated staff and our engaged community, we will continue to cultivate a culture of excellence, curiosity, and kindness.
              </p>

              <p>
                Thank you for being part of our story. Let&apos;s strive for greatness and make this school year our best one.
              </p>

              <div className="pt-4 space-y-2">
                <p>Warmly,</p>
                <p className="font-medium text-slate-900">Mr. Kel Jordan</p>
                <div className="pt-1">
                  <span className="font-serif italic text-2xl text-slate-800 tracking-wide">
                    Mr. Kel Jordan
                  </span>
                </div>
              </div>
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
            <Link href="/director" className="hover:text-amber-400 transition">Director</Link>
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
