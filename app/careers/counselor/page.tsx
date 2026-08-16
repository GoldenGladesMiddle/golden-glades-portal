'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldAlert, Search, Menu, X, ChevronDown } from 'lucide-react';

export default function CounselorApplicationPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    email: '',
    reqAvailability: false,
    reqUnderstood: false,
    rpName: '',
    robloxUsername: '',
    discordUsername: '',
    counselingRating: '',
    whyApply: '',
    studentConflictScenario: '',
    confidentialityScenario: '',
    device: '',
    resultsMethod: '',
    resultsOtherDetails: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (value ?? ''),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/apply/counselor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('There was an issue submitting your application. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An unexpected error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <div>
        <div className="bg-[#1a3861] text-slate-200 text-xs py-1.5 px-4 md:px-8 flex justify-between items-center border-b border-blue-900/40">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-amber-400 font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" /> Emergency Alerts: Active
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline">School ID#: 8284465</span>
          </div>
        </div>

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
          </div>
        </header>

        <section className="bg-gradient-to-r from-[#284b85] to-[#1a3861] text-white py-12 px-4 md:px-8 border-b-4 border-amber-400">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">GGMS | Guidance Counselor Application</h1>
            <p className="text-amber-300 text-sm md:text-base">Golden Glades Middle School Student Support Services</p>
          </div>
        </section>

        <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 flex-grow w-full">
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
                <h2 className="text-2xl font-bold text-slate-800">Counselor Application Submitted!</h2>
                <p className="text-slate-600 text-sm max-w-md mx-auto">Thank you for applying. Your application will be reviewed shortly by student services.</p>
                <Link href="/" className="inline-block mt-4 bg-[#284b85] hover:bg-[#1a3861] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition">Return to Home</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">1. Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Your email address" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">2. What is your RP Name? <span className="text-red-500">*</span></label>
                  <input type="text" name="rpName" value={formData.rpName} onChange={handleChange} required placeholder="Example: Ms. C. Rivers" className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">3. What is your ROBLOX username? <span className="text-red-500">*</span></label>
                  <input type="text" name="robloxUsername" value={formData.robloxUsername} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">4. What is your DISCORD username? <span className="text-red-500">*</span></label>
                  <input type="text" name="discordUsername" value={formData.discordUsername} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">5. Why do you want to be a Guidance Counselor at GGMS? <span className="text-red-500">*</span></label>
                  <textarea rows={3} name="whyApply" value={formData.whyApply} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">6. How would you handle a situation where two students are involved in a major disagreement? <span className="text-red-500">*</span></label>
                  <textarea rows={3} name="studentConflictScenario" value={formData.studentConflictScenario} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">7. What device do you primarily play Roblox on? <span className="text-red-500">*</span></label>
                  <select name="device" value={formData.device} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm bg-white">
                    <option value="">Choose</option>
                    <option value="Laptop/PC">Laptop/PC</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Tablet/iPad">Tablet/iPad</option>
                  </select>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-[#284b85] hover:bg-[#1a3861] text-white font-bold py-3 px-6 rounded-lg text-sm transition mt-6 disabled:opacity-50">
                  {isSubmitting ? 'Submitting Application...' : 'Submit Counselor Application'}
                </button>
              </form>
            )}
          </div>
        </main>
      </div>

      <footer>
        <div className="bg-[#1a3861] text-slate-300 text-xs py-8 px-4 md:px-8 border-t border-blue-900 text-center">
          <p>© 2026 Golden Glades Middle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
