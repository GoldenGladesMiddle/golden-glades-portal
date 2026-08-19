'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldAlert, Search, Menu, X, ChevronDown } from 'lucide-react';

interface StaffMember {
  name: string;
  role: string;
  image?: string;
}

export default function DirectoryPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const leadership: StaffMember[] = [
    { name: 'Kel Jordan', role: 'Director', image: '/avatars/kel.png' },
    { name: 'Kita Fever', role: 'Vice Director' },
    { name: 'Niyla Redding', role: 'Head School Administrator' },
    { name: 'VACANT', role: 'School Administrator' },
    { name: 'VACANT', role: 'School Administrator' },
    { name: 'VACANT', role: 'School Administrator' },
  ];

  const teachers: StaffMember[] = [
    { name: 'VACANT', role: 'Core Teacher | English' },
    { name: 'VACANT', role: 'Core Teacher | History' },
    { name: 'VACANT', role: 'Core Teacher | Science' },
    { name: 'VACANT', role: 'Elective Teacher | Art' },
    { name: 'VACANT', role: 'Elective Teacher | Culinary' },
    { name: 'VACANT', role: 'Elective Teacher | Drama' },
    { name: 'VACANT', role: 'Elective Teacher | Gym' },
  ];

  const counselors: StaffMember[] = [
    { name: 'VACANT', role: 'Guidance Counselor | 5th & 6th' },
    { name: 'VACANT', role: 'Guidance Counselor | 7th & 8th' },
    { name: 'VACANT', role: 'Guidance Counselor | SPED' },
  ];

  const teachingAssistants: StaffMember[] = Array(12).fill({
    name: 'VACANT',
    role: 'Teaching Assistant',
  });

  const nurses: StaffMember[] = Array(4).fill({
    name: 'VACANT',
    role: 'Nurse',
  });

  const officeStaff: StaffMember[] = Array(4).fill({
    name: 'VACANT',
    role: 'Office Associate',
  });

  const securityStaff: StaffMember[] = Array(7).fill({
    name: 'VACANT',
    role: 'School Security',
  });

  const renderSection = (title: string, staffList: StaffMember[]) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-2 border-slate-200">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {staffList.map((member, index) => (
          <div key={index} className="flex items-center space-x-6 p-4">
            <div className="w-32 h-32 bg-gray-100 border border-dashed border-gray-300 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden relative">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                {member.name}
              </h3>
              <p className="text-slate-600 font-medium text-sm mt-1">
                {member.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col justify-between">
      <div>
        {/* Top Utility Bar - #284b85 */}
        <div className="bg-[#284b85] text-slate-200 text-xs py-1.5 px-4 md:px-8 flex justify-between items-center border-b border-blue-900/40">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" /> Emergency Alerts: Active
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline">School ID#: 8284465</span>
          </div>
        </div>

        {/* Main Navigation Bar - #284b85 */}
        <header className="bg-[#284b85] text-white shadow-md sticky top-0 z-50 border-t border-blue-400/20">
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
            <div className="md:hidden bg-[#284b85] px-6 py-4 space-y-3 border-t border-blue-800 text-sm">
              <a href="#" className="block text-slate-100 hover:text-amber-300">Admissions</a>
              <a href="#" className="block text-slate-100 hover:text-amber-300">Resources</a>
              <a href="#" className="block text-slate-100 hover:text-amber-300">Schools</a>
              <a href="#" className="block text-slate-100 hover:text-amber-300">News</a>
              <Link href="/careers" className="block text-amber-300 font-bold">Careers</Link>
              <a href="/api/auth/roblox" className="block text-slate-100 hover:text-amber-300 font-bold">Portal</a>
            </div>
          )}
        </header>

        {/* Directory Page Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12 md:py-16 text-slate-800">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Staff Directory</h1>

          {renderSection('Leadership', leadership)}
          {renderSection('Teachers', teachers)}
          {renderSection('Counselors', counselors)}
          {renderSection('Teaching Assistants', teachingAssistants)}
          {renderSection('Nurses', nurses)}
          {renderSection('Office Staff', officeStaff)}
          {renderSection('Security', securityStaff)}
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
        <div className="bg-[#284b85] text-slate-200 text-xs py-8 px-4 md:px-8 border-t border-blue-900">
          <div className="max-w-7xl mx-auto text-center md:text-left">
            <p>© 2026 Golden Glades Middle. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
