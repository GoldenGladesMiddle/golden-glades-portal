'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Heart, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  GraduationCap
} from 'lucide-react';

export default function CareersPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const staffPositions = [
    'Core Teacher',
    'Elective Teacher',
    'Substitute Teacher',
    'Teaching Aide',
    'School Security',
    'Office Secretary',
    'Nurse'
  ];

  const counselorPositions = [
    '6th & 7th Grade Counselor',
    '8th & SPED Counselor'
  ];

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
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="/" className="hover:text-amber-300 transition">Home</a>
            <a href="#" className="hover:text-amber-300 transition">Admissions</a>
            <a href="#" className="hover:text-amber-300 transition">Resources</a>
          </nav>

          <div className="flex items-center justify-center py-1">
            <a href="/" className="transform hover:scale-105 transition block">
              <Image 
                src="/logo.png" 
                alt="Golden Glades Middle Logo" 
                width={80} 
                height={80} 
                className="w-20 h-20 object-contain drop-shadow-md"
                priority
              />
            </a>
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

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1a3861] px-6 py-4 space-y-3 border-t border-blue-800 text-sm">
            <a href="/" className="block text-slate-100 hover:text-amber-300">Home</a>
            <a href="#" className="block text-slate-100 hover:text-amber-300">Admissions</a>
            <a href="#" className="block text-slate-100 hover:text-amber-300">Resources</a>
            <a href="/careers" className="block text-amber-300 font-bold">Careers</a>
            <a href="/api/auth/roblox" className="block text-slate-100 hover:text-amber-300 font-bold">Portal</a>
          </div>
        )}
      </header>

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-r from-[#284b85] to-[#1a3861] text-white py-16 px-4 md:px-8 border-b-4 border-amber-400">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border border-amber-400/30">
            <Briefcase className="w-4 h-4" /> Join Our Faculty
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Careers at Golden Glades Middle</h1>
          <p className="text-amber-300 italic text-lg md:text-xl font-serif">
            &quot;Where Future Leaders Strive&quot;
          </p>
        </div>
      </section>

      {/* Custom Navigation Bar */}
      <div className="bg-black text-white text-xs font-semibold py-3 px-4 md:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-y-2 gap-x-6 text-center">
          <a href="#" className="hover:text-amber-400 transition">Partnerships</a>
          <a href="#" className="hover:text-amber-400 transition">Calendars</a>
          <a href="/careers" className="text-amber-400 transition font-bold">Careers</a>
          <a href="#" className="hover:text-amber-400 transition">Directory</a>
          <a href="#" className="hover:text-amber-400 transition">School</a>
          <a href="#" className="hover:text-amber-400 transition">Director</a>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 flex-grow space-y-16">
        {/* Intro Section */}
        <section className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a3861]">Welcome to Our Community</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed text-base">
            <p>
              Here at Golden Glades Middle, we are more than a place for learning. We are a community with one vision of academic excellence, growth, and opportunity.
            </p>
            <p>
              Our motto, <strong className="text-slate-800">&quot;Where Future Leaders Strive&quot;</strong>, reflects our belief that when we work together, we can create an environment where both students and staff are able to thrive.
            </p>
          </div>
        </section>

        {/* Why Work With Us Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a3861]">Why Work With Us?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-sm md:text-base">
              When you join our team, that means you are a part of a supportive and collaborative school culture. We believe everyone from teachers and administration to support personnel play an important role in shaping our students&apos; future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#284b85] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Supportive Community</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We value respect, open communication, and teamwork across all departments.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#284b85] flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Professional Growth</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We encourage leadership development, continuous learning, and innovation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#284b85] flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">Student-Centered Focus</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The decisions we make are focused on what is best for our students.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#284b85] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg">School Pride</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                With our dedication to excellence and our school colors, we take pride in being Golden Glades Middle.
              </p>
            </div>
          </div>
        </section>

        {/* Who We're Looking For Section */}
        <section className="bg-slate-100 rounded-2xl p-8 md:p-10 border border-slate-200 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a3861]">Who We&apos;re Looking For</h2>
            <p className="text-slate-600 text-sm md:text-base">
              We are looking for passionate people who are committed to education, growth, and dedicated to making a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Normal Staff Applications */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#284b85] border-b pb-3 border-slate-100">
                <Briefcase className="w-5 h-5" />
                <h3 className="font-bold text-lg text-slate-900">Normal Staff Application</h3>
              </div>
              <ul className="space-y-2.5">
                {staffPositions.map((pos, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{pos}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Counselor Applications */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#284b85] border-b pb-3 border-slate-100">
                <GraduationCap className="w-5 h-5" />
                <h3 className="font-bold text-lg text-slate-900">School Counselor Application</h3>
              </div>
              <ul className="space-y-2.5">
                {counselorPositions.map((pos, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{pos}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* How to Apply Section */}
        <section className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200 shadow-sm space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1a3861]">How to Apply</h2>
            <p className="text-slate-600 text-sm md:text-base">
              Explore our open positions available above and apply using our simple 4-step process:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <span className="inline-block bg-[#284b85] text-white text-xs font-bold px-2.5 py-1 rounded">Step 1</span>
              <h3 className="font-bold text-slate-900">Browse Careers</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review current openings and find a role that matches your interests.
              </p>
            </div>

            <div className="space-y-2">
              <span className="inline-block bg-[#284b85] text-white text-xs font-bold px-2.5 py-1 rounded">Step 2</span>
              <h3 className="font-bold text-slate-900">Submit Application</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete the online application form with your relevant information.
              </p>
            </div>

            <div className="space-y-2">
              <span className="inline-block bg-[#284b85] text-white text-xs font-bold px-2.5 py-1 rounded">Step 3</span>
              <h3 className="font-bold text-slate-900">Selection & Training</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If selected, you will receive a message via your preferred service. Administration will train you on the following school day.
              </p>
            </div>

            <div className="space-y-2">
              <span className="inline-block bg-[#284b85] text-white text-xs font-bold px-2.5 py-1 rounded">Step 4</span>
              <h3 className="font-bold text-slate-900">Join Our Team</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Begin your career with us and help achieve our shared goals for success.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-center">
            <a 
              href="/api/auth/roblox" 
              className="bg-[#284b85] hover:bg-[#1a3861] text-white font-bold py-3.5 px-8 rounded-full shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm"
            >
              Start Application <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-[#1a3861] text-slate-400 text-xs py-8 px-4 md:px-8 border-t border-blue-900 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Golden Glades Middle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
