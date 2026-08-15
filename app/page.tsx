'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  UserCheck, 
  Calendar, 
  BookOpen, 
  Bell, 
  ShieldAlert, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  User,
  Settings,
  ChevronDown
} from 'lucide-react';

export default function Home() {
  const [role, setRole] = useState<string>('student');
  const [username, setUsername] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
      return null;
    };

    const savedRole = getCookie('user_role');
    const savedUser = getCookie('roblox_username');

    if (savedRole) setRole(savedRole);
    if (savedUser) setUsername(savedUser);
  }, []);

  const quickLinks = {
    admin: [
      { title: 'Admin Console', icon: Settings, desc: 'Manage site settings, user roles, and district policies.' },
      { title: 'Staff Directory', icon: BookOpen, desc: 'Access administration contact details and rosters.' },
      { title: 'District Calendar', icon: Calendar, desc: 'Schedule district events and testing windows.' },
      { title: 'Emergency Alerts', icon: ShieldAlert, desc: 'Broadcast school alerts and urgent announcements.' },
    ],
    staff: [
      { title: 'Teacher Portal', icon: UserCheck, desc: 'Submit grades, manage attendance, and rosters.' },
      { title: 'Staff Directory', icon: BookOpen, desc: 'Contact administration and department heads.' },
      { title: 'District Calendar', icon: Calendar, desc: 'Professional development & school events.' },
      { title: 'Staff Resources', icon: Bell, desc: 'Curriculum guides and HR documents.' },
    ],
    student: [
      { title: 'Student Portal', icon: UserCheck, desc: 'View grades, attendance, and class schedules.' },
      { title: 'Class Schedules', icon: BookOpen, desc: 'Check period timings and room assignments.' },
      { title: 'District Calendar', icon: Calendar, desc: 'Holidays, exam schedules, and event dates.' },
      { title: 'Announcements', icon: Bell, desc: 'Latest updates from school administration.' },
    ],
    guest: [
      { title: 'Parent & Visitor Portal', icon: UserCheck, desc: 'School info and visitor guides.' },
      { title: 'Public Calendar', icon: Calendar, desc: 'Key district dates and events.' },
    ],
  };

  const links = quickLinks[role as keyof typeof quickLinks] || quickLinks.guest;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
      {/* Top Utility Bar */}
      <div className="bg-[#1a3861] text-slate-200 text-xs py-1.5 px-4 md:px-8 flex justify-between items-center border-b border-blue-900/40">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" /> Emergency Alerts: Active
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline">District ID: #8284465</span>
        </div>
        <div className="flex items-center space-x-4">
          {username ? (
            <div className="flex items-center space-x-2 text-amber-300 font-medium">
              <User className="w-3.5 h-3.5" />
              <span>{username} ({role.toUpperCase()})</span>
            </div>
          ) : (
            <a href="/api/auth/roblox" className="text-amber-400 font-semibold hover:underline">
              Log In with Roblox
            </a>
          )}
        </div>
      </div>

      {/* M-DCPS Style Main Navigation Bar */}
      <header className="bg-[#284b85] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation Left Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#" className="hover:text-amber-300 transition">Admissions</a>
            <a href="#" className="hover:text-amber-300 transition">Resources</a>
            <a href="#" className="hover:text-amber-300 transition">Schools</a>
          </nav>

          {/* Centered School Logo */}
          <div className="flex items-center justify-center">
            <a href="#" className="transform hover:scale-105 transition">
              <Image 
                src="/logo.png" 
                alt="Golden Glades Middle Logo" 
                width={48} 
                height={48} 
                className="w-12 h-12 object-contain"
              />
            </a>
          </div>

          {/* Desktop Navigation Right Links & Actions */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#" className="hover:text-amber-300 transition">News</a>
            <a href="#" className="hover:text-amber-300 transition">Portal</a>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-1 cursor-pointer hover:text-amber-300 transition text-xs font-semibold">
              <span>English</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </div>

            {/* Search Button */}
            <button className="hover:text-amber-300 transition focus:outline-none">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Right Search */}
          <button className="md:hidden text-white focus:outline-none">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1a3861] px-6 py-4 space-y-3 border-t border-blue-800 text-sm">
            <a href="#" className="block text-slate-100 hover:text-amber-300">Admissions</a>
            <a href="#" className="block text-slate-100 hover:text-amber-300">Resources</a>
            <a href="#" className="block text-slate-100 hover:text-amber-300">Schools</a>
            <a href="#" className="block text-slate-100 hover:text-amber-300">News</a>
            <a href="#" className="block text-slate-100 hover:text-amber-300">Portal</a>
            {!username && (
              <a 
                href="/api/auth/roblox" 
                className="block text-center bg-amber-500 text-[#1a3861] font-bold py-2 rounded-md mt-2"
              >
                Log In with Roblox
              </a>
            )}
          </div>
        )}
      </header>

      {/* Hero Banner Section */}
      <section className="bg-gradient-to-r from-[#284b85] to-[#1a3861] text-white py-14 px-4 md:px-8 border-b-4 border-amber-400">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">GOLDEN GLADES MIDDLE</h2>
          <p className="text-slate-200 text-sm md:text-base max-w-2xl mx-auto">
            Your Best Choice for Middle School Education
          </p>
          <div className="pt-4 max-w-xl mx-auto relative">
            <input 
              type="text" 
              placeholder="Search services, staff, or documents..."
              className="w-full pl-11 pr-4 py-3 rounded-full text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-lg text-sm"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          </div>
        </div>
      </section>

      {/* Quick Links Dashboard Display */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 flex-grow w-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">
            {role.toUpperCase()} Dashboard Features
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {links.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#284b85] flex items-center justify-center mb-4 group-hover:bg-[#284b85] group-hover:text-white transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#284b85] group-hover:translate-x-1 transition">
                  Access Now <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="bg-[#1a3861] text-slate-400 text-xs py-8 px-4 md:px-8 border-t border-blue-900 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Golden Glades Middle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
