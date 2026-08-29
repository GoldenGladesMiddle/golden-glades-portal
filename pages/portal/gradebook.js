// pages/portal/gradebook.js
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

export default function StudentGradebook() {
  const [user, setUser] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('portal_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchGrades(parsedUser.roblox_id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchGrades = async (studentId) => {
    const { data, error } = await supabase
      .from('grades')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setGrades(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <Head>
        <title>Golden Glades Middle - Student Gradebook</title>
      </Head>

      <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-gray-900">Golden Glades Middle</h1>
        <Link href="/dashboard" className="text-xs font-semibold text-blue-600 hover:underline">
          ➔ Back to Dashboard
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto mt-10 px-4">
        <div className="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-1">Student Gradebook</h2>
          <p className="text-xs text-gray-500 mb-6">
            Viewing records for {user ? user.roblox_username : 'Student'}
          </p>

          {loading ? (
            <p className="text-sm text-gray-500">Loading grades...</p>
          ) : grades.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No grades recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-xs font-semibold text-gray-600 uppercase bg-gray-50">
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Assignment</th>
                    <th className="py-3 px-4">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {grades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{grade.subject}</td>
                      <td className="py-3 px-4 text-gray-600">{grade.assignment_name}</td>
                      <td className="py-3 px-4 font-bold text-blue-600">{grade.score}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}