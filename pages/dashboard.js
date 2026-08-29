import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const SUBJECTS = ['Science', 'Cooking', 'English', 'Drama', 'Gym', 'History', 'Art', 'Speech & Debate'];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);

  // Data states
  const [grades, setGrades] = useState([]);
  const [detentions, setDetentions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [allGrades, setAllGrades] = useState([]);

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
    fetchDashboardData(parsedUser.roblox_id, parsedUser.roblox_username, parsedUser.role);
  }, []);

  const fetchDashboardData = async (robloxId, username, role) => {
    setLoading(true);
    try {
      // Fetch personal grades
      const { data: gradesData } = await supabase
        .from('grades')
        .select('*')
        .eq('student_id', robloxId);
      setGrades(gradesData || []);

      // Fetch personal detentions
      const { data: detentionData } = await supabase
        .from('detentions')
        .select('*')
        .eq('student_id', robloxId);
      setDetentions(detentionData || []);

      // Fetch personal messages
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_username', username)
        .order('created_at', { ascending: false });
      setMessages(msgData || []);

      // If Staff or Admin, fetch all users and all grades for master gradebook
      if (role === 'staff' || role === 'admin') {
        const { data: studentsData } = await supabase
          .from('users')
          .select('*')
          .order('roblox_username', { ascending: true });
        setAllStudents(studentsData || []);

        const { data: masterGradesData } = await supabase
          .from('grades')
          .select('*')
          .order('created_at', { ascending: false });
        setAllGrades(masterGradesData || []);
      }
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
      fetchDashboardData(user.roblox_id, user.roblox_username, user.role);
    }
  };

  const handleDeleteGrade = async (gradeId) => {
    const { error } = await supabase
      .from('grades')
      .delete()
      .eq('id', gradeId);

    if (error) {
      setAdminMessage('Error deleting grade: ' + error.message);
    } else {
      setAdminMessage('Grade entry removed.');
      fetchDashboardData(user.roblox_id, user.roblox_username, user.role);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('portal_user');
    router.push('/');
  };

  if (loading || !user) {
    return <div className="min-h-screen bg-gray-100 text-gray-800 flex items-center justify-center font-sans">Loading portal...</div>;
  }

  const isStaffOrAdmin = user.role === 'staff' || user.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col font-sans">
      {/* Light Navbar */}
      <header className="bg-white border-b border-gray-200 px-8 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-gray-900 tracking-tight cursor-pointer" onClick={() => setActiveTab('home')}>
            Golden Glades
          </span>
          
          <nav className="flex items-center gap-4 text-xs font-semibold tracking-wider text-gray-600 uppercase">
            <button 
              onClick={() => setActiveTab('grades')} 
              className={`hover:text-gray-900 transition flex items-center gap-1 ${activeTab === 'grades' ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-0.5' : ''}`}>
              📝 Grades
            </button>
            <button 
              onClick={() => setActiveTab('detentions')} 
              className={`hover:text-gray-900 transition flex items-center gap-1 ${activeTab === 'detentions' ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-0.5' : ''}`}>
              👓 Detentions
            </button>
            <button 
              onClick={() => setActiveTab('messages')} 
              className={`hover:text-gray-900 transition flex items-center gap-1 ${activeTab === 'messages' ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-0.5' : ''}`}>
              ✉️ Messages ({messages.length})
            </button>
            {isStaffOrAdmin && (
              <>
                <button 
                  onClick={() => setActiveTab('masterGradebook')} 
                  className={`hover:text-gray-900 transition flex items-center gap-1 ${activeTab === 'masterGradebook' ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-0.5' : ''}`}>
                  📊 Master Gradebook
                </button>
                <button 
                  onClick={() => setActiveTab('admin')} 
                  className={`hover:text-gray-900 transition flex items-center gap-1 ${activeTab === 'admin' ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-0.5' : ''}`}>
                  🛡️ Staff Panel
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{user.roblox_username}</span>
          <button 
            onClick={handleLogout} 
            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded font-semibold transition">
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-8">
        
        {/* HOME TAB */}
        {activeTab === 'home' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col items-center text-center shadow-sm">
              <div className="w-36 h-36 bg-gray-50 rounded border border-gray-100 flex items-center justify-center overflow-hidden mb-4">
                <img 
                  src={`https://www.roblox.com/headshot-thumbnail/image?userId=${user.roblox_id}&width=180&height=180&format=png`} 
                  alt={user.roblox_username}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://tr.rbxcdn.com/30day-avatar-headshot'; }}
                />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">{user.roblox_username}</h2>
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded font-medium mb-4">{user.group_role_name}</span>

              <a 
                href="https://discord.gg" 
                target="_blank" 
                rel="noreferrer" 
                className="w-full border border-blue-500 text-blue-500 hover:bg-blue-50 py-1.5 rounded text-xs font-bold transition flex items-center justify-center gap-1.5">
                💬 Discord
              </a>
            </div>

            <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h1 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                Welcome, {user.roblox_username}!
              </h1>

              <div className="flex gap-3 items-start">
                <span className="text-amber-500 text-lg">📣</span>
                <div>
                  <div className="text-xs text-gray-400 font-semibold mb-1">System · Golden Glades Middle</div>
                  <p className="text-sm text-gray-700">
                    The administration welcomes you to the Golden Glades Middle School portal! Check your grades, review detention logs, manage class rosters, and message staff directly from your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PERSONAL GRADES TAB */}
        {activeTab === 'grades' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900 mb-1">My Gradebook</h1>
            <p className="text-xs text-gray-500 mb-6">Course evaluations and academic record for Golden Glades Middle.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUBJECTS.map((subj) => {
                const subGrades = grades.filter(g => g.subject.toLowerCase() === subj.toLowerCase());
                const avg = subGrades.length > 0 ? (subGrades.reduce((acc, curr) => acc + Number(curr.score), 0) / subGrades.length).toFixed(1) : 'N/A';

                return (
                  <div key={subj} className="bg-gray-50 p-4 rounded border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-sm text-gray-800">{subj}</h3>
                      <span className="text-xs bg-white text-gray-600 border border-gray-200 px-2 py-0.5 rounded font-semibold">Avg: {avg}</span>
                    </div>
                    {subGrades.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No grade records posted.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {subGrades.map((g, idx) => (
                          <li key={idx} className="flex justify-between text-xs bg-white p-2 rounded border border-gray-100">
                            <span className="text-gray-600">{g.assignment_name}</span>
                            <span className="font-bold text-gray-900">{g.score}%</span>
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

        {/* MASTER STAFF/ADMIN GRADEBOOK TAB */}
        {activeTab === 'masterGradebook' && isStaffOrAdmin && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Master Staff Gradebook</h1>
            <p className="text-xs text-gray-500 mb-6">View, search, and manage student assignment scores across all classes.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-xs text-gray-600 uppercase border-b border-gray-200">
                    <th className="p-3">Student</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Assignment</th>
                    <th className="p-3">Score</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-800">
                  {allGrades.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-gray-400 italic">No grades recorded in the school system yet.</td>
                    </tr>
                  ) : (
                    allGrades.map((g) => {
                      const studentUser = allStudents.find(s => Number(s.roblox_id) === Number(g.student_id));
                      return (
                        <tr key={g.id} className="hover:bg-gray-50">
                          <td className="p-3 font-semibold">{studentUser ? studentUser.roblox_username : `ID: ${g.student_id}`}</td>
                          <td className="p-3"><span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">{g.subject}</span></td>
                          <td className="p-3">{g.assignment_name}</td>
                          <td className="p-3 font-bold text-gray-900">{g.score}%</td>
                          <td className="p-3 text-right">
                            <button 
                              onClick={() => handleDeleteGrade(g.id)}
                              className="text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition">
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DETENTIONS TAB */}
        {activeTab === 'detentions' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Disciplinary Record</h1>
            <p className="text-xs text-gray-500 mb-6">Active detentions and infractions registered on your account.</p>

            {detentions.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded border border-gray-200 text-center text-xs text-gray-500">
                No active detentions found on record.
              </div>
            ) : (
              <div className="space-y-3">
                {detentions.map((d, idx) => (
                  <div key={idx} className="bg-red-50/50 p-4 rounded border border-red-200 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="text-red-700 font-bold text-xs uppercase tracking-wider">Detention Notice</span>
                      <span className="text-xs text-gray-400">{new Date(d.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-800 mt-1"><strong>Reason:</strong> {d.reason}</p>
                    <p className="text-xs text-gray-500">Issued by: <span className="font-medium text-gray-700">{d.issued_by}</span></p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Campus Inbox</h1>
            <p className="text-xs text-gray-500 mb-6">Direct communication channel with staff and peers.</p>

            <form onSubmit={handleSendMessage} className="bg-gray-50 p-4 rounded border border-gray-200 mb-6 flex flex-col gap-3">
              <h3 className="font-bold text-xs uppercase text-gray-600 tracking-wider">Send Message</h3>
              {sendSuccess && <p className="text-xs bg-emerald-50 text-emerald-700 p-2 rounded border border-emerald-200">{sendSuccess}</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  placeholder="Recipient Roblox Username" 
                  value={recipient} 
                  onChange={e => setRecipient(e.target.value)}
                  required
                  className="bg-white border border-gray-300 p-2 rounded text-xs text-gray-800 outline-none focus:border-blue-500"
                />
                <input 
                  type="text" 
                  placeholder="Title" 
                  value={msgTitle} 
                  onChange={e => setMsgTitle(e.target.value)}
                  required
                  className="bg-white border border-gray-300 p-2 rounded text-xs text-gray-800 outline-none focus:border-blue-500"
                />
              </div>
              <textarea 
                placeholder="Message body..." 
                value={msgBody} 
                onChange={e => setMsgBody(e.target.value)}
                required
                rows={3}
                className="bg-white border border-gray-300 p-2 rounded text-xs text-gray-800 outline-none focus:border-blue-500 resize-none"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded text-xs transition w-fit">
                Submit Message
              </button>
            </form>

            <h3 className="font-bold text-xs uppercase text-gray-600 tracking-wider mb-3">Received Messages</h3>
            {messages.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No messages found in your inbox.</p>
            ) : (
              <div className="space-y-2">
                {messages.map((m, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200 flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-xs text-gray-900">{m.title}</h4>
                      <span className="text-[10px] text-gray-400">{new Date(m.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-600">{m.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STAFF ADMIN TAB */}
        {activeTab === 'admin' && isStaffOrAdmin && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Staff Management Panel</h1>
            <p className="text-xs text-gray-500 mb-6">Issue detentions and input assignment marks for registered students.</p>

            {adminMessage && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-800 mb-6">
                {adminMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Issue Detention */}
              <form onSubmit={handleIssueDetention} className="bg-gray-50 p-4 rounded border border-gray-200 flex flex-col gap-3">
                <h3 className="font-bold text-xs uppercase text-gray-600 tracking-wider">Issue Detention</h3>
                <input 
                  type="text" 
                  placeholder="Student Roblox Username" 
                  value={studentUsername}
                  onChange={e => setStudentUsername(e.target.value)}
                  required
                  className="bg-white border border-gray-300 p-2 rounded text-xs text-gray-800 outline-none focus:border-blue-500"
                />
                <input 
                  type="text" 
                  placeholder="Reason" 
                  value={detentionReason}
                  onChange={e => setDetentionReason(e.target.value)}
                  required
                  className="bg-white border border-gray-300 p-2 rounded text-xs text-gray-800 outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-1.5 px-4 rounded text-xs transition w-fit">
                  Issue Notice
                </button>
              </form>

              {/* Post Grade */}
              <form onSubmit={handlePostGrade} className="bg-gray-50 p-4 rounded border border-gray-200 flex flex-col gap-3">
                <h3 className="font-bold text-xs uppercase text-gray-600 tracking-wider">Input Assignment Score</h3>
                <input 
                  type="text" 
                  placeholder="Student Roblox Username" 
                  value={studentUsername}
                  onChange={e => setStudentUsername(e.target.value)}
                  required
                  className="bg-white border border-gray-300 p-2 rounded text-xs text-gray-800 outline-none focus:border-blue-500"
                />
                <select 
                  value={gradeSubject} 
                  onChange={e => setGradeSubject(e.target.value)}
                  className="bg-white border border-gray-300 p-2 rounded text-xs text-gray-800 outline-none focus:border-blue-500">
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input 
                  type="text" 
                  placeholder="Assignment Name" 
                  value={assignmentName}
                  onChange={e => setAssignmentName(e.target.value)}
                  required
                  className="bg-white border border-gray-300 p-2 rounded text-xs text-gray-800 outline-none focus:border-blue-500"
                />
                <input 
                  type="number" 
                  placeholder="Score (0-100)" 
                  value={scoreValue}
                  onChange={e => setScoreValue(e.target.value)}
                  required
                  className="bg-white border border-gray-300 p-2 rounded text-xs text-gray-800 outline-none focus:border-blue-500"
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded text-xs transition w-fit">
                  Submit Grade
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
