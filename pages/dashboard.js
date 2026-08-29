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
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading portal...</div>;
  }

  const isStaffOrAdmin = user.role === 'staff' || user.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-bold tracking-wide text-emerald-400">Golden Glades Middle Portal</h1>
          <p className="text-xs text-slate-400">Logged in as <span className="text-white font-medium">{user.roblox_username}</span> ({user.group_role_name})</p>
        </div>
        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold transition">
          Log Out
        </button>
      </header>

      <div className="flex flex-1 max-w-7xl w-full mx-auto p-6 gap-6">
        <aside className="w-64 bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-col gap-2 h-fit">
          <button 
            onClick={() => setActiveTab('grades')} 
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'grades' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
            📚 Gradebook
          </button>
          <button 
            onClick={() => setActiveTab('detentions')} 
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'detentions' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
            ⚠️ Detentions
          </button>
          <button 
            onClick={() => setActiveTab('messages')} 
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'messages' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
            💬 Messages Inbox
          </button>
          {isStaffOrAdmin && (
            <button 
              onClick={() => setActiveTab('admin')} 
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${activeTab === 'admin' ? 'bg-amber-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}>
              🛡️ Staff Admin Panel
            </button>
          )}
        </aside>

        <main className="flex-1 bg-slate-900 p-6 rounded-xl border border-slate-800">
          {activeTab === 'grades' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Student Gradebook</h2>
              <p className="text-slate-400 text-sm mb-6">Review your assignment scores across all middle school subjects.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {SUBJECTS.map((subj) => {
                  const subGrades = grades.filter(g => g.subject.toLowerCase() === subj.toLowerCase());
                  const avg = subGrades.length > 0 ? (subGrades.reduce((acc, curr) => acc + Number(curr.score), 0) / subGrades.length).toFixed(1) : 'N/A';
                  
                  return (
                    <div key={subj} className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-lg text-emerald-400">{subj}</h3>
                        <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-300">Average: {avg}</span>
                      </div>
                      {subGrades.length === 0 ? (
                        <p className="text-xs text-slate-500 italic">No assignments recorded yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {subGrades.map((g, idx) => (
                            <li key={idx} className="flex justify-between text-sm bg-slate-900 p-2 rounded">
                              <span className="text-slate-300">{g.assignment_name}</span>
                              <span className="font-bold text-white">{g.score}</span>
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

          {activeTab === 'detentions' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Disciplinary Record</h2>
              <p className="text-slate-400 text-sm mb-6">Active detentions and behavioral notices issued by school staff.</p>

              {detentions.length === 0 ? (
                <div className="bg-slate-950 p-8 rounded-lg border border-slate-800 text-center text-slate-400">
                  🎉 Clean record! You have no active detentions.
                </div>
              ) : (
                <div className="space-y-4">
                  {detentions.map((d, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-lg border border-red-900/50 flex flex-col gap-1">
                      <div className="flex justify-between">
                        <span className="text-red-400 font-semibold">Detention Notice</span>
                        <span className="text-xs text-slate-500">{new Date(d.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-200 mt-1"><strong className="text-slate-400">Reason:</strong> {d.reason}</p>
                      <p className="text-xs text-slate-400 mt-2">Issued by: <span className="text-white">{d.issued_by}</span></p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-white">Campus Inbox & Messaging</h2>
              <p className="text-slate-400 text-sm mb-6">Communicate securely with peers and faculty members.</p>

              <form onSubmit={handleSendMessage} className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-8 flex flex-col gap-4">
                <h3 className="font-semibold text-emerald-400">New Message</h3>
                {sendSuccess && <p className="text-xs bg-emerald-950 text-emerald-400 p-2 rounded">{sendSuccess}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Recipient Roblox Username" 
                    value={recipient} 
                    onChange={e => setRecipient(e.target.value)}
                    required
                    className="bg-slate-900 border border-slate-700 p-2 rounded text-sm text-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Subject Title" 
                    value={msgTitle} 
                    onChange={e => setMsgTitle(e.target.value)}
                    required
                    className="bg-slate-900 border border-slate-700 p-2 rounded text-sm text-white"
                  />
                </div>
                <textarea 
                  placeholder="Type your message here..." 
                  value={msgBody} 
                  onChange={e => setMsgBody(e.target.value)}
                  required
                  rows={3}
                  className="bg-slate-900 border border-slate-700 p-2 rounded text-sm text-white"
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded text-sm transition w-fit">
                  Send Message
                </button>
              </form>

              <h3 className="font-semibold text-lg text-white mb-4">Received Messages</h3>
              {messages.length === 0 ? (
                <p className="text-slate-500 text-sm italic">Your inbox is empty.</p>
              ) : (
                <div className="space-y-3">
                  {messages.map((m, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-white">{m.title}</h4>
                        <span className="text-xs text-slate-500">{new Date(m.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1">{m.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'admin' && isStaffOrAdmin && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-amber-400">Staff Administration Panel</h2>
              <p className="text-slate-400 text-sm mb-6">Manage student discipline records and input course grades.</p>

              {adminMessage && (
                <div className="bg-slate-950 border border-amber-500/50 p-3 rounded mb-6 text-sm text-amber-300">
                  {adminMessage}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <form onSubmit={handleIssueDetention} className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-3">
                  <h3 className="font-semibold text-white">Issue Detention</h3>
                  <input 
                    type="text" 
                    placeholder="Student Roblox Username" 
                    value={studentUsername}
                    onChange={e => setStudentUsername(e.target.value)}
                    required
                    className="bg-slate-900 border border-slate-700 p-2 rounded text-sm text-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Reason for detention" 
                    value={detentionReason}
                    onChange={e => setDetentionReason(e.target.value)}
                    required
                    className="bg-slate-900 border border-slate-700 p-2 rounded text-sm text-white"
                  />
                  <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded text-sm transition mt-2">
                    Issue Detention
                  </button>
                </form>

                <form onSubmit={handlePostGrade} className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-3">
                  <h3 className="font-semibold text-white">Input Assignment Grade</h3>
                  <input 
                    type="text" 
                    placeholder="Student Roblox Username" 
                    value={studentUsername}
                    onChange={e => setStudentUsername(e.target.value)}
                    required
                    className="bg-slate-900 border border-slate-700 p-2 rounded text-sm text-white"
                  />
                  <select 
                    value={gradeSubject} 
                    onChange={e => setGradeSubject(e.target.value)}
                    className="bg-slate-900 border border-slate-700 p-2 rounded text-sm text-white">
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input 
                    type="text" 
                    placeholder="Assignment Name (e.g., Quiz 1)" 
                    value={assignmentName}
                    onChange={e => setAssignmentName(e.target.value)}
                    required
                    className="bg-slate-900 border border-slate-700 p-2 rounded text-sm text-white"
                  />
                  <input 
                    type="number" 
                    placeholder="Score (0-100)" 
                    value={scoreValue}
                    onChange={e => setScoreValue(e.target.value)}
                    required
                    className="bg-slate-900 border border-slate-700 p-2 rounded text-sm text-white"
                  />
                  <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded text-sm transition mt-2">
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