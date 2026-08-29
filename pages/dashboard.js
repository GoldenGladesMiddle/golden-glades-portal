import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const SUBJECTS = ['Science', 'Cooking', 'English', 'Drama', 'Gym', 'History', 'Art', 'Speech & Debate'];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('grades');
  const [loading, setLoading] = useState(true);

  // Data states
  const [grades, setGrades] = useState([]);
  const [detentions, setDetentions] = useState([]);
  const [messages, setMessages] = useState([]);

  // Form states for messaging
  const [recipient, setRecipient] = useState('');
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');

  // Admin form states
  const [studentUsername, setStudentUsername] = useState('');
  const [detentionReason, setDetentionReason] = useState('');
  const [gradeSubject, setGradeSubject] = useState('Science');
  const [assignmentName, setAssignmentName] = useState('');
  const [scoreValue, setScoreValue] = useState('');
  const [adminMessage, setAdminMessage] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('portal_user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchDashboardData(parsedUser.roblox_id, parsedUser.roblox_username);
  }, []);

  const fetchDashboardData = async (robloxId, username) => {
    setLoading(true);
    try {
      const { data: gradesData } = await supabase
        .from('grades')
        .select('*')
        .eq('student_id', robloxId);
      setGrades(gradesData || []);

      const { data: detentionData } = await supabase
        .from('detentions')
        .select('*')
        .eq('student_id', robloxId);
      setDetentions(detentionData || []);

      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_username', username)
        .order('created_at', { ascending: false });
      setMessages(msgData || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!recipient || !msgTitle || !msgBody) return;

    const { error } = await supabase.from('messages').insert({
      sender_id: user.roblox_id,
      recipient_username: recipient.trim(),
      title: msgTitle,
      body: msgBody,
      is_read: false
    });

    if (error) {
      setSendSuccess('Failed to send message: ' + error.message);
    } else {
      setSendSuccess('Message sent successfully!');
      setRecipient('');
      setMsgTitle('');
      setMsgBody('');
      setTimeout(() => setSendSuccess(''), 4000);
    }
  };

  const handleIssueDetention = async (e) => {
    e.preventDefault();
    const { data: targetUser } = await supabase
      .from('users')
      .select('roblox_id')
      .ilike('roblox_username', studentUsername.trim())
      .single();

    if (!targetUser) {
      setAdminMessage('Error: Student username not found in database.');
      return;
    }

    const { error } = await supabase.from('detentions').insert({
      student_id: targetUser.roblox_id,
      reason: detentionReason,
      issued_by: user.roblox_username
    });

    if (error) {
      setAdminMessage('Error issuing detention: ' + error.message);
    } else {
      setAdminMessage('Detention issued successfully to ' + studentUsername);
      setStudentUsername('');
      setDetentionReason('');
    }
  };

  const handlePostGrade = async (e) => {
    e.preventDefault();
    const { data: targetUser } = await supabase
      .from('users')
      .select('roblox_id')
      .ilike('roblox_username', studentUsername.trim())
      .single();

    if (!targetUser) {
      setAdminMessage('Error: Student username not found.');
      return;
    }

    const { error } = await supabase.from('grades').insert({
      student_id: targetUser.roblox_id,
      subject: gradeSubject,
      assignment_name: assignmentName,
      score: Number(scoreValue)
    });

    if (error) {
      setAdminMessage('Error posting grade: ' + error.message);
    } else {
      setAdminMessage('Grade posted successfully for ' + studentUsername);
      setStudentUsername('');
      setAssignmentName('');
      setScoreValue('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portal_user');
    router.push('/');
  };

  if (loading || !user) {
    return <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center font-sans">Loading portal...</div>;
  }

  const isStaffOrAdmin = user.role === 'staff' || user.role === 'admin';

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="bg-[#161b22] border-b border-gray-800 px-6 py-4 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl font-bold tracking-wide text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block"></span>
            Golden Glades Middle Portal
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Logged in as <span className="text-gray-200 font-medium">{user.roblox_username}</span> ({user.group_role_name})</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="bg-[#21262d] hover:bg-[#30363d] text-gray-200 border border-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
          Log Out
        </button>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto p-6 gap-6">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-[#161b22] p-4 rounded-xl border border-gray-800 flex flex-col gap-2 h-fit shadow-md">
          <button 
            onClick={() => setActiveTab('grades')} 
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition text-sm flex items-center gap-3 ${activeTab === 'grades' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-[#21262d] text-gray-300'}`}>
            📚 Gradebook
          </button>
          <button 
            onClick={() => setActiveTab('detentions')} 
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition text-sm flex items-center gap-3 ${activeTab === 'detentions' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-[#21262d] text-gray-300'}`}>
            ⚠️ Detentions
          </button>
          <button 
            onClick={() => setActiveTab('messages')} 
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition text-sm flex items-center gap-3 ${activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-[#21262d] text-gray-300'}`}>
            💬 Messages Inbox
          </button>
          {isStaffOrAdmin && (
            <button 
              onClick={() => setActiveTab('admin')} 
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition text-sm flex items-center gap-3 ${activeTab === 'admin' ? 'bg-amber-600 text-white shadow-md' : 'hover:bg-[#21262d] text-gray-300'}`}>
              🛡️ Staff Admin Panel
            </button>
          )}
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-[#161b22] p-6 rounded-xl border border-gray-800 shadow-md">
          
          {/* GRADES TAB */}
          {activeTab === 'grades' && (
            <div>
              <h2 className="text-2xl font-bold mb-1 text-white">Student Gradebook</h2>
              <p className="text-gray-400 text-sm mb-6">Review your assignment scores across all middle school subjects.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {SUBJECTS.map((subj) => {
                  const subGrades = grades.filter(g => g.subject.toLowerCase() === subj.toLowerCase());
                  const avg = subGrades.length > 0 ? (subGrades.reduce((acc, curr) => acc + Number(curr.score), 0) / subGrades.length).toFixed(1) : 'N/A';
                  
                  return (
                    <div key={subj} className="bg-[#0d1117] p-4 rounded-xl border border-gray-800 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-base text-white">{subj}</h3>
                        <span className="text-xs bg-[#21262d] text-gray-300 border border-gray-700 px-2.5 py-1 rounded-full font-medium">Average: {avg}</span>
                      </div>
                      {subGrades.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">No assignments recorded yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {subGrades.map((g, idx) => (
                            <li key={idx} className="flex justify-between text-sm bg-[#161b22] border border-gray-800 p-2.5 rounded-lg">
                              <span className="text-gray-300">{g.assignment_name}</span>
                              <span className="font-semibold text-white">{g.score}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* DETENTIONS TAB */}
          {activeTab === 'detentions' && (
            <div>
              <h2 className="text-2xl font-bold mb-1 text-white">Disciplinary Record</h2>
              <p className="text-gray-400 text-sm mb-6">Active detentions and behavioral notices issued by school staff.</p>

              {detentions.length === 0 ? (
                <div className="bg-[#0d1117] p-8 rounded-xl border border-gray-800 text-center text-gray-400 shadow-sm">
                  🎉 Clean record! You have no active detentions.
                </div>
              ) : (
                <div className="space-y-4">
                  {detentions.map((d, idx) => (
                    <div key={idx} className="bg-[#0d1117] p-4 rounded-xl border border-red-900/40 shadow-sm flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="text-red-400 font-semibold text-sm">Detention Notice</span>
                        <span className="text-xs text-gray-500">{new Date(d.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-200 text-sm mt-1"><strong className="text-gray-400">Reason:</strong> {d.reason}</p>
                      <p className="text-xs text-gray-400 mt-2">Issued by: <span className="text-white font-medium">{d.issued_by}</span></p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div>
              <h2 className="text-2xl font-bold mb-1 text-white">Campus Inbox & Messaging</h2>
              <p className="text-gray-400 text-sm mb-6">Communicate securely with peers and faculty members.</p>

              {/* Compose box */}
              <form onSubmit={handleSendMessage} className="bg-[#0d1117] p-5 rounded-xl border border-gray-800 shadow-sm mb-8 flex flex-col gap-4">
                <h3 className="font-semibold text-white text-sm">New Message</h3>
                {sendSuccess && <p className="text-xs bg-emerald-950/60 border border-emerald-800 text-emerald-400 p-2.5 rounded-lg">{sendSuccess}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Recipient Roblox Username" 
                    value={recipient} 
                    onChange={e => setRecipient(e.target.value)}
                    required
                    className="bg-[#161b22] border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2.5 rounded-lg text-sm text-white outline-none transition"
                  />
                  <input 
                    type="text" 
                    placeholder="Subject Title" 
                    value={msgTitle} 
                    onChange={e => setMsgTitle(e.target.value)}
                    required
                    className="bg-[#161b22] border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2.5 rounded-lg text-sm text-white outline-none transition"
                  />
                </div>
                <textarea 
                  placeholder="Type your message here..." 
                  value={msgBody} 
                  onChange={e => setMsgBody(e.target.value)}
                  required
                  rows={3}
                  className="bg-[#161b22] border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2.5 rounded-lg text-sm text-white outline-none transition resize-none"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition shadow-sm w-fit">
                  Send Message
                </button>
              </form>

              {/* Inbox list */}
              <h3 className="font-semibold text-base text-white mb-4">Received Messages</h3>
              {messages.length === 0 ? (
                <p className="text-gray-500 text-sm italic">Your inbox is empty.</p>
              ) : (
                <div className="space-y-3">
                  {messages.map((m, idx) => (
                    <div key={idx} className="bg-[#0d1117] p-4 rounded-xl border border-gray-800 shadow-sm flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-white text-sm">{m.title}</h4>
                        <span className="text-xs text-gray-500">{new Date(m.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{m.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STAFF ADMIN PANEL */}
          {activeTab === 'admin' && isStaffOrAdmin && (
            <div>
              <h2 className="text-2xl font-bold mb-1 text-amber-400">Staff Administration Panel</h2>
              <p className="text-gray-400 text-sm mb-6">Manage student discipline records and input course grades.</p>

              {adminMessage && (
                <div className="bg-[#0d1117] border border-amber-500/40 p-3 rounded-lg mb-6 text-sm text-amber-300 shadow-sm">
                  {adminMessage}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Issue Detention Form */}
                <form onSubmit={handleIssueDetention} className="bg-[#0d1117] p-5 rounded-xl border border-gray-800 shadow-sm flex flex-col gap-3">
                  <h3 className="font-semibold text-white text-sm">Issue Detention</h3>
                  <input 
                    type="text" 
                    placeholder="Student Roblox Username" 
                    value={studentUsername}
                    onChange={e => setStudentUsername(e.target.value)}
                    required
                    className="bg-[#161b22] border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 p-2.5 rounded-lg text-sm text-white outline-none transition"
                  />
                  <input 
                    type="text" 
                    placeholder="Reason for detention" 
                    value={detentionReason}
                    onChange={e => setDetentionReason(e.target.value)}
                    required
                    className="bg-[#161b22] border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 p-2.5 rounded-lg text-sm text-white outline-none transition"
                  />
                  <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition mt-2 shadow-sm w-fit">
                    Issue Detention
                  </button>
                </form>

                {/* Post Grade Form */}
                <form onSubmit={handlePostGrade} className="bg-[#0d1117] p-5 rounded-xl border border-gray-800 shadow-sm flex flex-col gap-3">
                  <h3 className="font-semibold text-white text-sm">Input Assignment Grade</h3>
                  <input 
                    type="text" 
                    placeholder="Student Roblox Username" 
                    value={studentUsername}
                    onChange={e => setStudentUsername(e.target.value)}
                    required
                    className="bg-[#161b22] border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2.5 rounded-lg text-sm text-white outline-none transition"
                  />
                  <select 
                    value={gradeSubject} 
                    onChange={e => setGradeSubject(e.target.value)}
                    className="bg-[#161b22] border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2.5 rounded-lg text-sm text-white outline-none transition">
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Assignment Name (e.g., Quiz 1)" 
                    value={assignmentName}
                    onChange={e => setAssignmentName(e.target.value)}
                    required
                    className="bg-[#161b22] border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2.5 rounded-lg text-sm text-white outline-none transition"
                  />
                  <input 
                    type="number" 
                    placeholder="Score (0-100)" 
                    value={scoreValue}
                    onChange={e => setScoreValue(e.target.value)}
                    required
                    className="bg-[#161b22] border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-2.5 rounded-lg text-sm text-white outline-none transition"
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition mt-2 shadow-sm w-fit">
                    Post Grade
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}