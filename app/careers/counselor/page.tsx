'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldAlert, Search, Menu, X, ChevronDown } from 'lucide-react';

export default function CounselorApplicationPage() {
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
              <button className="hover:text-[#amber-300] transition focus:outline-none"><Search className="w-4 h-4" /></button>
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
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">GGMS | School Counselor Application</h1>
            <p className="text-amber-300 text-sm md:text-base">Are you interested in serving as a counselor at Golden Glades Middle School? Apply below.</p>
          </div>
        </section>

        {/* Application Form Container */}
        <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 flex-grow w-full">
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <div className="border-b border-slate-200 pb-4">
              <p className="text-xs text-slate-500">Thank you for your interest in applying to join Golden Glades Middle School. We're excited you chose to apply here. Before you can continue, you MUST read and check the following below.</p>
              <p className="text-xs text-red-500 font-medium mt-1">* Indicates required question</p>
            </div>

            <form className="space-y-6">
              {/* Requirements & Confirmations */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">1. Email <span className="text-red-500">*</span></label>
                  <input type="email" required placeholder="Your email address" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">2. I understand that I must be available at least three weekdays (Monday–Friday) for supporting students. <span className="text-red-500">*</span></label>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="counselor_req_1" name="counselor_req_1" required className="text-[#284b85] focus:ring-[#284b85]" />
                    <label htmlFor="counselor_req_1" className="text-sm text-slate-700">I understand.</label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">3. School Counselors at GGMS are expected to demonstrate professionalism, confidentiality, empathy, and strong communication skills. Please confirm that you understand these expectations. <span className="text-red-500">*</span></label>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="counselor_req_2" name="counselor_req_2" required className="text-[#284b85] focus:ring-[#284b85]" />
                    <label htmlFor="counselor_req_2" className="text-sm text-slate-700">I understand.</label>
                  </div>
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* Personal Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">4. What is your RP Name? <span className="text-red-500">*</span></label>
                  <p className="text-xs text-slate-500 mb-2">RP name must include both first initial and last name. (This does not have to be your real name) (Example: Mr. K Jordan)</p>
                  <input type="text" required placeholder="Your answer" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">5. What is your ROBLOX username? <span className="text-red-500">*</span></label>
                  <input type="text" required placeholder="Your answer" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">6. What is your DISCORD username? <span className="text-red-500">*</span></label>
                  <input type="text" required placeholder="Your answer" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" />
                </div>
              </div>

              <hr className="border-slate-200" />

              {/* Skill Ratings & Scenarios */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">7. On a scale of 1-10, how would you rate your communication skills? <span className="text-red-500">*</span></label>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200 overflow-x-auto text-xs">
                    <span className="text-slate-500">Poor</span>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <label key={num} className="flex flex-col items-center mx-1">
                        <span>{num}</span>
                        <input type="radio" name="counselor_comm_scale" value={num} required className="mt-1" />
                      </label>
                    ))}
                    <span className="text-slate-500">Excellent</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">8. On a scale of 1-5, how comfortable are you handling student conflicts? <span className="text-red-500">*</span></label>
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                    <span className="text-slate-500">Not Comfortable</span>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <label key={num} className="flex flex-col items-center mx-1">
                        <span>{num}</span>
                        <input type="radio" name="counselor_conflict_scale" value={num} required className="mt-1" />
                      </label>
                    ))}
                    <span className="text-slate-500">Very Comfortable</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">9. Why do you want to be a School Counselor at GGMS? <span className="text-red-500">*</span></label>
                  <textarea rows={3} required placeholder="Your answer" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">10. If a student approaches you saying, "Nobody here likes me and I don't want to be here." How would you respond? <span className="text-red-500">*</span></label>
                  <textarea rows={3} required placeholder="Your answer" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">11. What makes you standing from other applicants? <span className="text-red-500">*</span></label>
                  <textarea rows={3} required placeholder="Your answer" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">12. What is your estimated employment time at GGMS if accepted? <span className="text-red-500">*</span></label>
                  <textarea rows={3} required placeholder="Your answer" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">13. How would you handle a student who is upset, crying, or overwhelmed? <span className="text-red-500">*</span></label>
                  <textarea rows={3} required placeholder="Your answer" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">14. What device do you primarily play Roblox on? <span className="text-red-500">*</span></label>
                  <select required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm bg-white">
                    <option value="">Choose</option>
                    <option value="Laptop/PC">Laptop/PC</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Tablet/iPad">Tablet/iPad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">15. How would you like to receive your results? If Other, please specify with your details. <span className="text-red-500">*</span></label>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="counselor_res_email" name="counselor_results_method" value="Email" required />
                      <label htmlFor="counselor_res_email">Email</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="counselor_res_discord" name="counselor_results_method" value="Discord" />
                      <label htmlFor="counselor_res_discord">Discord</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="counselor_res_other" name="counselor_results_method" value="Other" />
                      <label htmlFor="counselor_res_other">Other:</label>
                      <input type="text" placeholder="Specify details" className="px-3 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#284b85]" />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#284b85] hover:bg-[#1a3861] text-white font-bold py-3 px-6 rounded-lg text-sm transition mt-6">
                Submit Counselor Application
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
