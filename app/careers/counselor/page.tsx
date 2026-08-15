'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldAlert, User, Search, Menu, X, ChevronDown, GraduationCap, Send, CheckCircle } from 'lucide-react';

export default function CounselorApplicationPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
      <section className="bg-gradient-to-r from-[#284b85] to-[#1a3861] text-white py-12 px-4 md:px-8 border-b-4 border-amber-400">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-amber-400/30">
            <GraduationCap className="w-4 h-4" /> Counseling Services
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">GGMS | School Counselor Application</h1>
          <p className="text-amber-300 italic text-sm md:text-base font-serif">Are you interested in serving as a counselor at Golden Glades Middle School? Apply below.</p>
        </div>
      </section>

      {/* Bottom Bar Navigation */}
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

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-10 flex-grow w-full">
        {submitted ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-900">Application Submitted!</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Your application has been submitted. Thank you for applying. You will receive a DM about your results in 1-2 days.
            </p>
            <Link href="/careers" className="inline-block bg-[#284b85] text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-[#1a3861] transition">
              Back to Careers
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            {/* Information & Expectations Section */}
            <div className="border-b border-slate-200 pb-6 space-y-4">
              <h2 className="text-xl font-bold text-[#1a3861]">Information & Expectations</h2>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Email *</label>
                <input type="email" required placeholder="your.email@example.com" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#284b85] focus:outline-none" />
              </div>

              <div className="space-y-3 pt-2">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                  <p className="text-xs text-slate-700 font-medium">I understand that I must be available at least three weekdays (Monday–Friday) for supporting students. *</p>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input type="radio" name="counselorReq1" required value="I understand." className="text-[#284b85] focus:ring-[#284b85]" />
                    I understand.
                  </label>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                  <p className="text-xs text-slate-700 font-medium">School Counselors at GGMS are expected to demonstrate professionalism, confidentiality, empathy, and strong communication skills. Please confirm that you understand these expectations. *</p>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                    <input type="radio" name="counselorReq2" required value="I understand." className="text-[#284b85] focus:ring-[#284b85]" />
                    I understand.
                  </label>
                </div>
              </div>
            </div>

            {/* Survey & Scenario Questions */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#1a3861]">Counselor Assessment Survey</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">RP Name *</label>
                  <input type="text" required placeholder="e.g. Mr. K Jordan" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#284b85] focus:outline-none" />
                  <p className="text-[10px] text-slate-500 mt-1">Must include first initial & last name.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">ROBLOX Username *</label>
                  <input type="text" required placeholder="Roblox Username" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#284b85] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">DISCORD Username *</label>
                  <input type="text" required placeholder="Discord Username" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#284b85] focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">On a scale of 1-10, how would you rate your communication skills? *</label>
                <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
                  <span className="text-[11px] font-semibold text-slate-500 mr-2">Poor</span>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <label key={num} className="flex flex-col items-center gap-1 text-xs cursor-pointer px-1">
                      <span>{num}</span>
                      <input type="radio" name="commScale" required value={num} className="text-[#284b85] focus:ring-[#284b85]" />
                    </label>
                  ))}
                  <span className="text-[11px] font-semibold text-slate-500 ml-2">Excellent</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">On a scale of 1-5, how comfortable are you handling student conflicts? *</label>
                <div className="flex items-center justify-between gap-2 max-w-md">
                  <span className="text-[11px] font-semibold text-slate-500">Not Comfortable</span>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <label key={num} className="flex flex-col items-center gap-1 text-xs cursor-pointer">
                      <span>{num}</span>
                      <input type="radio" name="conflictScale" required value={num} className="text-[#284b85] focus:ring-[#284b85]" />
                    </label>
                  ))}
                  <span className="text-[11px] font-semibold text-slate-500">Very Comfortable</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Why do you want to be a School Counselor at GGMS? *</label>
                <textarea required rows={3} placeholder="Your response..." className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#284b85] focus:outline-none"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">If a student approaches you saying, &quot;Nobody here likes me and I don&apos;t want to be here.&quot; How would you respond? *</label>
                <textarea required rows={3} placeholder="Your response..." className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#284b85] focus:outline-none"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">What makes you standing from other applicants? *</label>
                <textarea required rows={3} placeholder="Your response..." className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#284b85] focus:outline-none"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">What is your estimated employment time at GGMS if accepted? *</label>
                <input type="text" required placeholder="e.g. 3-6 months, long-term, etc." className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#284b85] focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">How would you handle a student who is upset, crying, or overwhelmed? *</label>
                <textarea required rows={3} placeholder="Your response..." className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#284b85] focus:outline-none"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">What device do you primarily play Roblox on? *</label>
                <select required className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#284b85] focus:outline-none">
                  <option value="">Select Device</option>
                  <option value="Laptop/PC">Laptop/PC</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Tablet/iPad">Tablet/iPad</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">How would you like to receive your results? *</label>
                <input type="text" required placeholder="Email, Discord, or Other (with details)" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#284b85] focus:outline-none" />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#284b85] hover:bg-[#1a3861] text-white font-bold py-3 rounded-xl shadow transition flex items-center justify-center gap-2 text-sm">
              <Send className="w-4 h-4" /> Submit Application
            </button>
          </form>
        )}
      </main>

      <footer className="bg-[#1a3861] text-slate-400 text-xs py-8 px-4 md:px-8 border-t border-blue-900 mt-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p>© {new Date().getFullYear()} Golden Glades Middle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
