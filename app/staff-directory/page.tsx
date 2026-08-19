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
            <div className="w-32 h-32 bg-gray-100 border border-dashed border-gray-300 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800">
                {member.name}
              </h3>
              <p className="text-slate-600 font-medium text-sm mt-1">
                {member.role}
              </p>
            </div>
          </div>
        ))}
      </div>
      <hr className="my-8 border-t border-slate-700" />
    </div>
  );

  return (
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
  );
}
