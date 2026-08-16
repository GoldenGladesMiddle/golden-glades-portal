'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldAlert, Search, Menu, X, ChevronDown } from 'lucide-react';

export default function StaffApplicationPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    reqDays: false,
    reqUnderstood: false,
    rpName: '',
    robloxUsername: '',
    discordUsername: '',
    position: '',
    grammarRating: '',
    activeRating: '',
    whyApply: '',
    grammarCorrection: '',
    standOut: '',
    estimatedEmployment: '',
    disruptiveStudent: '',
    device: '',
    resultsMethod: '',
    resultsOtherDetails: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send form data to API endpoint or Webhook handler
      const response = await fetch('/api/apply/staff', {
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
      alert('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <section className="bg-gradient-to-r from-[#284b85] to-[#1a3861] text-white py-12 px-4 md:px-8 border-b-4 border-amber-400">
          <div className="max-w-4xl mx-auto text-center space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">GGMS | Staff Application</h1>
            <p className="text-amber-300 text-sm md:text-base">Are you interested in working at GGMS? Apply here.</p>
          </div>
        </section>

        {/* Application Form Container */}
        <main className="max-w-3xl mx-auto px-4 md:px-8 py-12 flex-grow w-full">
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  ✓
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Application Submitted!</h2>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Thank you for applying to Golden Glades Middle School. Your submission has been received and will be reviewed by human resources shortly.
                </p>
                <Link href="/" className="inline-block mt-4 bg-[#284b85] hover:bg-[#1a3861] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition">
                  Return to Home
                </Link>
              </div>
            ) : (
              <>
                <div className="border-b border-slate-200 pb-4">
                  <p className="text-xs text-slate-500">Thank you for your interest in applying to join Golden Glades Middle School. We're excited you chose to apply here. Before you can continue, you MUST read and check the following below.</p>
                  <p className="text-xs text-red-500 font-medium mt-1">* Indicates required question</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Requirements & Confirmations */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">1. Email <span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required 
                        placeholder="Your email address" 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">2. I understand that I must have at least three free days from Monday to Friday. <span className="text-red-500">*</span></label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="reqDays" 
                          name="reqDays" 
                          checked={formData.reqDays}
                          onChange={handleChange}
                          required 
                          className="text-[#284b85] focus:ring-[#284b85] rounded" 
                        />
                        <label htmlFor="reqDays" className="text-sm text-slate-700">I understand.</label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">3. If you understand the requirements for a Staff Member at GGMS. Please select the "I understand" check box. <span className="text-red-500">*</span></label>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="reqUnderstood" 
                          name="reqUnderstood" 
                          checked={formData.reqUnderstood}
                          onChange={handleChange}
                          required 
                          className="text-[#284b85] focus:ring-[#284b85] rounded" 
                        />
                        <label htmlFor="reqUnderstood" className="text-sm text-slate-700">I understand.</label>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-200" />

                  {/* Personal Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">4. What is your RP Name? <span className="text-red-500">*</span></label>
                      <p className="text-xs text-slate-500 mb-2">RP name must include both first initial and last name. (This does not have to be your real name) (Example: Mr. K Jordan)</p>
                      <input 
                        type="text" 
                        name="rpName"
                        value={formData.rpName}
                        onChange={handleChange}
                        required 
                        placeholder="Your answer" 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">5. What is your ROBLOX username? <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="robloxUsername"
                        value={formData.robloxUsername}
                        onChange={handleChange}
                        required 
                        placeholder="Your answer" 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">6. What is your DISCORD username? <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        name="discordUsername"
                        value={formData.discordUsername}
                        onChange={handleChange}
                        required 
                        placeholder="Your answer" 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">7. What position are you interested in applying for? <span className="text-red-500">*</span></label>
                      <select 
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        required 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm bg-white"
                      >
                        <option value="">Choose</option>
                        <option value="Security">Security</option>
                        <option value="Office Secretary">Office Secretary</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Teaching Aide">Teaching Aide</option>
                        <option value="Substitute Teacher">Substitute Teacher</option>
                        <option value="Core Teacher">Core Teacher</option>
                        <option value="Elective Teacher">Elective Teacher</option>
                      </select>
                    </div>
                  </div>

                  <hr className="border-slate-200" />

                  {/* Skill Ratings & Questions */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">8. Based on a 1 to 10 scale, how would you rate your grammatical skills? <span className="text-red-500">*</span></label>
                      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200 overflow-x-auto text-xs">
                        <span className="text-slate-500">Poor</span>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <label key={num} className="flex flex-col items-center mx-1 cursor-pointer">
                            <span>{num}</span>
                            <input 
                              type="radio" 
                              name="grammarRating" 
                              value={num} 
                              checked={formData.grammarRating === String(num)}
                              onChange={handleChange}
                              required 
                              className="mt-1" 
                            />
                          </label>
                        ))}
                        <span className="text-slate-500">Excellent</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">9. Based on a 1 to 5 scale, how active are you? <span className="text-red-500">*</span></label>
                      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                        <span className="text-slate-500">Inactive</span>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <label key={num} className="flex flex-col items-center mx-1 cursor-pointer">
                            <span>{num}</span>
                            <input 
                              type="radio" 
                              name="activeRating" 
                              value={num} 
                              checked={formData.activeRating === String(num)}
                              onChange={handleChange}
                              required 
                              className="mt-1" 
                            />
                          </label>
                        ))}
                        <span className="text-slate-500">Very Active</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">10. Why do you want to work at GGMS? <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={3} 
                        name="whyApply"
                        value={formData.whyApply}
                        onChange={handleChange}
                        required 
                        placeholder="Your answer" 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">11. How would you fix this, "Welkum to golden Glades Middul. How kan I help u?" <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={3} 
                        name="grammarCorrection"
                        value={formData.grammarCorrection}
                        onChange={handleChange}
                        required 
                        placeholder="Your answer" 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">12. What makes you stand out from other applicants? <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={3} 
                        name="standOut"
                        value={formData.standOut}
                        onChange={handleChange}
                        required 
                        placeholder="Your answer" 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">13. What do you think your estimated employment time at GGMS would be? <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={3} 
                        name="estimatedEmployment"
                        value={formData.estimatedEmployment}
                        onChange={handleChange}
                        required 
                        placeholder="Your answer" 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-1">14. How would you handle a disruptive student? <span className="text-red-500">*</span></label>
                      <textarea 
                        rows={3} 
                        name="disruptiveStudent"
                        value={formData.disruptiveStudent}
                        onChange={handleChange}
                        required 
                        placeholder="Your answer" 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm" 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">15. What device do you primarily play Roblox on? <span className="text-red-500">*</span></label>
                      <select 
                        name="device"
                        value={formData.device}
                        onChange={handleChange}
                        required 
                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#284b85] text-sm bg-white"
                      >
                        <option value="">Choose</option>
                        <option value="Laptop/PC">Laptop/PC</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Tablet/iPad">Tablet/iPad</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">16. How would you like to receive your results? Please specify how you would want to get your results if "Other" was chosen. <span className="text-red-500">*</span></label>
                      <div className="space-y-2 text-sm text-slate-700">
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="res_email" 
                            name="resultsMethod" 
                            value="Email" 
                            checked={formData.resultsMethod === 'Email'}
                            onChange={handleChange}
                            required 
                          />
                          <label htmlFor="res_email">Email</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="res_discord" 
                            name="resultsMethod" 
                            value="Discord" 
                            checked={formData.resultsMethod === 'Discord'}
                            onChange={handleChange}
                          />
                          <label htmlFor="res_discord">Discord</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id="res_other" 
                            name="resultsMethod" 
                            value="Other" 
                            checked={formData.resultsMethod === 'Other'}
                            onChange={handleChange}
                          />
                          <label htmlFor="res_other">Other:</label>
                          <input 
                            type="text" 
                            name="resultsOtherDetails"
                            value={formData.resultsOtherDetails}
                            onChange={handleChange}
                            placeholder="Specify details" 
                            disabled={formData.resultsMethod !== 'Other'}
                            className="px-3 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#284b85] disabled:bg-slate-100" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#284b85] hover:bg-[#1a3861] text-white font-bold py-3 px-6 rounded-lg text-sm transition mt-6 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Submit Staff Application'}
                  </button>
                </form>
              </>
            )}
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
