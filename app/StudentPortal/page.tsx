'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  FileText, 
  LogOut, 
  Search, 
  Users, 
  HeartHandshake, 
  MessageCircle,
  ShieldAlert
} from 'lucide-react';

interface UserData {
  displayName: string;
  username: string;
  userId: string | number;
  avatarUrl: string;
}

export default function StudentPortalPage() {
  const router = useRouter();
  
  // Sample user state - populate this with your Roblox OAuth/Session state
  const [user, setUser] = useState<UserData>({
    displayName: 'Guest Student',
    username: 'GuestUser',
    userId: '000000',
    avatarUrl: 'https://tr.rbxcdn.com/30bf54089e0839e53b6f2c3d5262ef00/150/150/AvatarHeadshot/Png' // Default Roblox fallback
  });

  // Fetch Roblox user details & avatar dynamically if logged in
  useEffect(() => {
    async function loadUserData() {
      try {
        // Replace with your actual user session or state fetch
        const res = await fetch('/api/user/me');
        if (res.ok) {
          const data = await res.json();
          setUser({
            displayName: data.displayName || data.username,
            username: data.username,
            userId: data.userId,
            // Fetch Roblox avatar headshot
            avatarUrl: `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${data.userId}&size=150x150&format=Png&isCircular=true`
          });
        }
      } catch (err) {
        console.error('Failed to load user profile:', err);
      }
    }
    loadUserData();
  }, []);

  // Logout handler
  const handleSignOut = useCallback(() => {
    // Add logic to clear user tokens/session here
    router.push('/');
  }, [router]);

  // 20-minute inactivity logout logic
  useEffect(() => {
    const INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 minutes in milliseconds
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        alert('You have been logged out due to 20 minutes of inactivity.');
        handleSignOut();
      }, INACTIVITY_LIMIT);
    };

    // Event listeners to detect user activity
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    activityEvents.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // Initialize timer on mount

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [handleSignOut]);

  return (
    <div className="min-h-screen bg-[#f7f5f0] flex flex-col md:flex-row font-sans">
      {/* Left Sidebar */}
      <aside className="w-full md:w-80 bg-[#0a3560] text-white flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="flex items-start space-x-4 border-b border-blue-900/60 pb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-900 border-2 border-white/20 shrink-0 relative">
              <Image 
                src={user.avatarUrl} 
                alt={user.displayName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="space-y-1 overflow-hidden">
              <h2 className="text-base font-bold uppercase tracking-wide truncate text-white">
                {user.displayName}
              </h2>
              <p className="text-xs text-blue-200 truncate">@{user.username}</p>
              <p className="text-xs text-blue-300 font-mono">User ID: {user.userId}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 text-sm font-semibold">
            <Link 
              href="/StudentPortal/gradebook" 
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-blue-900/50 transition text-slate-100"
            >
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Gradebook</span>
            </Link>

            <Link 
              href="/StudentPortal/report-card" 
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-blue-900/50 transition text-slate-100"
            >
              <FileText className="w-5 h-5 text-amber-400" />
              <span>Report Card</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Sign Out */}
        <div className="pt-6 border-t border-blue-900/60">
          <button 
            onClick={handleSignOut}
            className="flex items-center space-x-3 w-full text-left px-3 py-2.5 rounded-lg hover:bg-red-950/40 text-slate-200 hover:text-red-300 transition text-sm font-semibold"
          >
            <LogOut className="w-5 h-5 text-red-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Banner */}
        <header className="bg-gradient-to-r from-red-700 via-red-600 to-red-800 text-white py-6 px-8 shadow-md">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-center md:text-left">
            Welcome to Golden Glades Middle Student Portal
          </h1>
        </header>

        {/* Portal Dashboard Grid */}
        <div className="p-6 md:p-10 space-y-8 flex-1 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Announcement Card 1 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Student Government</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                    Get Involved! DSGA provides information on how students can participate, contact their school's SGA sponsor, and voice their concerns.
                  </p>
                </div>
                <button className="mt-4 inline-flex items-center justify-center border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-xs px-4 py-2 rounded-md transition w-fit">
                  Learn More
                </button>
              </div>
            </div>

            {/* Announcement Card 2 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Child Abuse Hotline & Support</h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                    To report abuse or seek support, please contact the helpline below: Telephone: 800-962-2873.
                  </p>
                </div>
                <button className="mt-4 inline-flex items-center justify-center border border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-xs px-4 py-2 rounded-md transition w-fit">
                  Report Abuse
                </button>
              </div>
            </div>
          </div>

          {/* Search & Resources Section */}
          <div className="text-center space-y-4 pt-6">
            <h2 className="text-2xl font-bold text-slate-800">Stay Connected. Stay Ahead.</h2>
            <p className="text-slate-600 text-sm">Find all the resources you need for the school year</p>
            <div className="max-w-xl mx-auto relative">
              <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search student Apps..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Floating Chat Widget */}
        <div className="fixed bottom-6 right-6">
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white p-3.5 rounded-full shadow-lg flex items-center justify-center transition">
            <MessageCircle className="w-7 h-7" />
          </button>
        </div>
      </main>
    </div>
  );
}
