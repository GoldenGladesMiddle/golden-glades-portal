'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldAlert, Search, Menu, X, ChevronDown, ExternalLink } from 'lucide-react';

export default function CareersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const STAFF_FORM_URL = "https://goldengladesms.org/careers/staff";
  const COUNSELOR_FORM_URL = "https://goldengladesms.org/careers/counselor";

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
        <section className="bg-gradient-to-r from-[#284b85] to-[#1a3861] text-white py-14 px-4 md:px-8 border-b-4 border-amber-400">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Careers at Golden Glades Middle</h1>
            <p className="text-amber-300 italic text-lg md:text-xl font-serif">"Where Future Leaders Strive"</p>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 flex-grow w-full space-y-12">
          {/* About Section */}
          <section className="space-y-4 text-slate-700 leading-relaxed bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <p>
              Here at Golden Glades Middle, we are more than a place for learning. We are a community with one vision of academic excellence, growth, and opportunity. Our motto, "Where Future Leaders Strive", reflects our belief that when we work together, we can create an environment where both students and staff are able to thrive.
            </p>
            <p>
              Here at Golden Glades Middle, we are more than a place for learning. We are a community with one vision of academic excellence, growth, and opportunity. Our motto, "Where Future Leaders Strive", reflects our belief that when we work together, we can create an environment where both students and staff are able to thrive.
            </p>
          </section>

          {/* Why Work With Us Section */}
          <section className="space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1a3861]">Why Work With Us?</h2>
            <p className="text-slate-700 leading-relaxed">
              When you join our team, that means you are a part of a supportive and collaborative school culture. We believe everyone from teachers and administration to support personnel play an important role in shaping our students future.
            </p>
            <p className="font-semibold text-slate-800">Here is why you should join our team:</p>
            <ul className="space-y-2 text-slate-700 list-disc list-inside pl-2">
              <li><strong className="text-slate-900">Supportive Community</strong> - We value respect, open communication, and teamwork.</li>
              <li><strong className="text-slate-900">Professional Growth</strong> - We encourage leadership development, continuous learning, and innovation.</li>
              <li><strong className="text-slate-900">Student-Centered Focus</strong> - The decisions we make is focused on what we want best for our students.</li>
              <li><strong className="text-slate-900">School Pride</strong> - With our dedication to excellence and our school colors, we take pride in being Golden Glades Middle.</li>
            </ul>
          </section>

          {/* Who We're Looking For Section */}
          <section className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#1a3861]">Who We're Looking For</h2>
              <p className="text-slate-700 leading-relaxed">
                We are looking for passionate people that are committed to education, growth, and dedication to make a different. These are the open positions:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Normal Staff Card */}
              <div className="border border-slate-200 bg-slate-50 p-6 rounded-xl space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#1a3861] border-b border-slate-200 pb-2 mb-3">Normal Staff Application</h3>
                  <ul className="space-y-1.5 text-sm text-slate-700 list-disc list-inside">
                    <li>Core Teacher</li>
                    <li>Elective Teacher</li>
                    <li>Substitute Teacher</li>
                    <li>Teaching Aide</li>
                    <li>School Security</li>
                    <li>Office Secretary</li>
                    <li>Nurse</li>
                  </ul>
                </div>
                <a 
                  href={STAFF_FORM_URL} 
                  className="mt-4 w-full bg-[#284b85] hover:bg-[#1a3861] text-white font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition"
                >
                  Apply for Staff <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* School Counselor Card */}
              <div className="border border-slate-200 bg-slate-50 p-6 rounded-xl space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#1a3861] border-b border-slate-200 pb-2 mb-3">School Counselor Application</h3>
                  <ul className="space-y-1.5 text-sm text-slate-700 list-disc list-inside">
                    <li>6th & 7th Grade Counselor</li>
                    <li>8th & SPED Counselor</li>
                  </ul>
                </div>
                <a 
                  href={COUNSELOR_FORM_URL} 
                  className="mt-4 w-full bg-[#284b85] hover:bg-[#1a3861] text-white font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition"
                >
                  Apply for Counselor <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </section>

          {/* How to Apply Section */}
          <section className="space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-[#1a3861]">How to Apply</h2>
            <p className="text-slate-700">Explore our open positions available above and apply using the form.</p>
            <ol className="space-y-3 text-slate-700 list-decimal list-inside pl-2">
              <li><strong className="text-slate-900">Browse Careers</strong> - Review the current openings and find a role that matches your interests.</li>
              <li>
                <strong className="text-slate-900">Submit Your Application</strong> - Complete the online application form using either the{' '}
                <a href={STAFF_FORM_URL} className="text-[#284b85] font-semibold underline hover:text-amber-600">Staff Application</a>{' '}
                or{' '}
                <a href={COUNSELOR_FORM_URL} className="text-[#284b85] font-semibold underline hover:text-amber-600">Guidance Counselor Application</a>.
              </li>
              <li><strong className="text-slate-900">Selection & Training</strong> - After you are selected, you will receive a message via your preferred messaging service. A member of administration will train you on the following school day.</li>
              <li><strong className="text-slate-900">Join Our Team</strong> - You will begin your career and help us achieve our goal for success.</li>
            </ol>
          </section>
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
