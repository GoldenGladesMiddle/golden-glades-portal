// pages/staff/gradebook.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function StaffGradebook() {
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('Science');
  const [assignmentName, setAssignmentName] = useState('');
  const [score, setScore] = useState('');
  const [status, setStatus] = useState('');

  const subjects = ['Science', 'Cooking', 'English', 'Drama', 'Gym', 'History', 'Art'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    const res = await fetch('/api/grades/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentRobloxId: studentId,
        subject,
        assignmentName,
        score,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus('Grade logged successfully!');
      setAssignmentName('');
      setScore('');
    } else {
      setStatus(`Error: ${data.message || data.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <Head>
        <title>Golden Glades Middle - Log Student Grade</title>
      </Head>

      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Golden Glades Middle</h1>
        <Link href="/dashboard" className="text-xs font-semibold text-blue-600 hover:underline">
          ➔ Back to Dashboard
        </Link>
      </nav>

      <main className="max-w-md mx-auto mt-10 px-4">
        <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Log Student Grade</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Student Roblox ID</label>
              <input
                type="number"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. 12345678"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Class Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Assignment Name</label>
              <input
                type="text"
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                placeholder="e.g. Quiz 1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Score (%)</label>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="e.g. 95"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {status && <p className="text-xs font-medium text-blue-600">{status}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded text-sm transition"
            >
              Submit Grade
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}