import React from 'react';

interface StaffMember {
  name: string;
  role: string;
  image?: string;
}

export default function StaffDirectoryPage() {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {staffList.map((member, index) => (
          <div key={index} className="flex items-center space-x-6 p-4">
            <div className="w-32 h-32 bg-gray-100 border border-dashed border-gray-300 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
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
      <hr className="my-8 border-t border-gray-200" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      <div>
        {/* Top Banner & Header */}
        <header className="bg-[#21437a] text-white">
          {/* Upper Thin Bar */}
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center space-x-4 text-sm border-b border-blue-900/40">
            <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Emergency Alerts: Active</span>
            </div>
            <span className="text-blue-300">|</span>
            <div className="text-slate-200 font-medium">
              School ID#: 8284465
            </div>
          </div>

          {/* Main Navigation Bar */}
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <nav className="flex items-center space-x-8 font-semibold text-base">
              <a href="#" className="hover:text-blue-200 transition">Admissions</a>
              <a href="#" className="hover:text-blue-200 transition">Resources</a>
              <a href="#" className="hover:text-blue-200 transition">Schools</a>
            </nav>

            <div className="flex justify-center">
              <img 
                src="/logo.png" 
                alt="Golden Glades Logo" 
                className="h-14 w-auto object-contain"
              />
            </div>

            <div className="flex items-center space-x-8 font-semibold text-base">
              <a href="#" className="hover:text-blue-200 transition">News</a>
              <a href="#" className="hover:text-blue-200 transition">Portal</a>
              
              <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-200 transition">
                <span>English</span>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>

              <button aria-label="Search" className="hover:text-blue-200 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Staff Directory Content */}
        <main className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Staff Directory</h1>

          {renderSection('Leadership', leadership)}
          {renderSection('Teachers', teachers)}
          {renderSection('Counselors', counselors)}
          {renderSection('Teaching Assistants', teachingAssistants)}
          {renderSection('Nurses', nurses)}
          {renderSection('Office Staff', officeStaff)}
          {renderSection('Security', securityStaff)}
        </main>
      </div>

      {/* Bottom Navigation & Footer */}
      <footer>
        {/* Upper Black Navigation Bar with Yellow Top Accent Line */}
        <div className="bg-black border-t-2 border-amber-400 text-white py-4">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-center space-x-12 md:space-x-20 text-sm font-bold tracking-wide">
            <a href="#" className="hover:text-gray-300 transition">Partnerships</a>
            <a href="#" className="hover:text-gray-300 transition">Calendars</a>
            <a href="#" className="hover:text-gray-300 transition">Careers</a>
            <a href="#" className="hover:text-gray-300 transition">Directory</a>
            <a href="#" className="hover:text-gray-300 transition">School</a>
            <a href="#" className="hover:text-gray-300 transition">Director</a>
          </div>
        </div>

        {/* Lower Blue Copyright Bar */}
        <div className="bg-[#21437a] text-white py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm font-medium">
            © 2026 Golden Glades Middle. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
