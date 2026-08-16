'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  LogOut,
  ShieldAlert,
  FileText,
  X,
  Briefcase
} from 'lucide-react';

interface Application {
  id: string;
  applicantName: string;
  position: 'Staff' | 'Guidance Counselor' | 'School Administrator';
  submittedDate: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  email: string;
  phone: string;
  experience: string;
  notes: string;
}

export default function ApplicationsDashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [positionFilter, setPositionFilter] = useState<string>('All');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Fetch applications on component load
  useEffect(() => {
    fetch('/api/applications')
      .then((res) => res.json())
      .then((data) => setApplications(data))
      .catch((err) => console.error('Error loading applications:', err));
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesPosition = positionFilter === 'All' || app.position === positionFilter;

    return matchesSearch && matchesStatus && matchesPosition;
  });

  const updateStatus = (id: string, newStatus: Application['status']) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
  };

  const handleLogout = () => {
    window.location.href = '/applications';
  };

  return (
    <div className="min-h-screen bg-[#f8f6f0] flex flex-col justify-between font-sans">
      <div>
        <header className="bg-[#284b85] text-white shadow-md sticky top-0 z-50">
          <div className="text-slate-200 text-xs py-1.5 px-4 md:px-8 flex justify-between items-center border-b border-blue-900/40">
            <div className="flex items-center space-x-4">
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5" /> Admin Control Panel
              </span>
              <span className="hidden sm:inline text-slate-400">|</span>
              <span className="hidden sm:inline">School ID#: 8284465</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-rose-300 hover:text-rose-100 transition font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="Golden Glades Middle Logo"
                width={50}
                height={50}
                className="w-12 h-12 object-contain drop-shadow-md"
                priority
              />
              <div>
                <h1 className="text-base font-bold leading-tight">Golden Glades Middle School</h1>
                <p className="text-xs text-amber-300 font-medium">Submitted Applications Workspace</p>
              </div>
            </div>

            <Link
              href="/AdminPortal"
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-amber-300 transition"
            >
              Main Admin Portal
            </Link>
          </div>
        </header>

        <div className="bg-[#32cd32] text-slate-900 py-3.5 px-6 text-center shadow-inner">
          <h2 className="text-lg md:text-xl font-extrabold tracking-wide">
            Submitted Applications Dashboard
          </h2>
        </div>

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-blue-100 text-[#0a3161] rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Applicants</p>
                <p className="text-xl font-bold text-slate-900">{applications.length}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Pending Review</p>
                <p className="text-xl font-bold text-slate-900">
                  {applications.filter((a) => a.status === 'Pending' || a.status === 'Under Review').length}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Approved</p>
                <p className="text-xl font-bold text-slate-900">
                  {applications.filter((a) => a.status === 'Approved').length}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-3 bg-rose-100 text-rose-700 rounded-lg">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Rejected</p>
                <p className="text-xl font-bold text-slate-900">
                  {applications.filter((a) => a.status === 'Rejected').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search applicant, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-600 font-medium">Position:</span>
                <select
                  value={positionFilter}
                  onChange={(e) => setPositionFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="All">All Positions</option>
                  <option value="Staff">Staff</option>
                  <option value="Guidance Counselor">Guidance Counselor</option>
                  <option value="School Administrator">School Administrator</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-600 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg py-2 px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#284b85] text-white text-xs font-semibold">
                    <th className="p-3.5">Application ID</th>
                    <th className="p-3.5">Applicant Name</th>
                    <th className="p-3.5">Applied Position</th>
                    <th className="p-3.5">Date Submitted</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 transition">
                        <td className="p-3.5 font-mono font-bold text-blue-900">{app.id}</td>
                        <td className="p-3.5 font-semibold text-slate-800">{app.applicantName}</td>
                        <td className="p-3.5 text-slate-700">
                          <span className="bg-slate-100 border border-slate-200 font-medium px-2 py-0.5 rounded text-[11px]">
                            {app.position}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">{app.submittedDate}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              app.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'Rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : app.status === 'Under Review'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="inline-flex items-center gap-1 bg-slate-100 hover:bg-[#0a3161] hover:text-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-md transition"
                          >
                            <Eye className="w-3.5 h-3.5" /> Review
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No applications found for the selected filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {selectedApp && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-800">{selectedApp.id}</span>
                  <h3 className="text-xl font-bold text-slate-900">{selectedApp.applicantName}</h3>
                </div>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-medium">Applied Position</span>
                    <span className="font-bold text-slate-800">{selectedApp.position}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Submission Date</span>
                    <span className="font-bold text-slate-800">{selectedApp.submittedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Email Address</span>
                    <span className="font-bold text-slate-800">{selectedApp.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Phone Number</span>
                    <span className="font-bold text-slate-800">{selectedApp.phone}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-blue-800" /> Background & Experience
                  </h4>
                  <p className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-700">
                    {selectedApp.experience}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-800" /> Admin Notes
                  </h4>
                  <p className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-slate-700">
                    {selectedApp.notes}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 space-y-3">
              <span className="text-xs font-bold text-slate-700 block">Update Application Status:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateStatus(selectedApp.id, 'Under Review')}
                  className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold py-2 rounded-lg text-xs transition"
                >
                  Under Review
                </button>
                <button
                  onClick={() => updateStatus(selectedApp.id, 'Approved')}
                  className="bg-emerald-600 text-white hover:bg-emerald-700 font-bold py-2 rounded-lg text-xs transition"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(selectedApp.id, 'Rejected')}
                  className="bg-rose-600 text-white hover:bg-rose-700 font-bold py-2 rounded-lg text-xs transition"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-black text-white text-xs font-semibold py-3.5 px-4 md:px-8 border-t-2 border-amber-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center md:justify-between gap-y-2 gap-x-6 text-center">
          <a href="#" className="hover:text-amber-400 transition">Partnerships</a>
          <a href="#" className="hover:text-amber-400 transition">Calendars</a>
          <Link href="/careers" className="hover:text-amber-400 transition">Careers</Link>
          <a href="#" className="hover:text-amber-400 transition">Directory</a>
          <a href="#" className="hover:text-amber-400 transition">School</a>
          <Link href="/director" className="hover:text-amber-400 transition">Director</Link>
        </div>
      </footer>
    </div>
  );
}
