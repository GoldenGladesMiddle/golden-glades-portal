import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const CLASSES = [
  'Science',
  'Cooking',
  'English',
  'Drama',
  'Gym',
  'History',
  'Art'
];

const GRADE_LEVELS = ['5th', '6th', '7th', '8th', 'SPED'];
const QUARTERS = ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'];
const CATEGORIES = ['All Categories', 'Homework', 'Quizzes', 'Tests', 'Projects'];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);

  // Personal data states
  const [grades, setGrades] = useState([]);
  const [detentions, setDetentions] = useState([]);
  const [messages, setMessages] = useState([]);

  // Gradebook Grid states (Staff/Admin)
  const [selectedClass, setSelectedClass] = useState('Science');
  const [selectedGradeLevel, setSelectedGradeLevel] = useState('5th');
  const [selectedQuarter, setSelectedQuarter] = useState('Quarter 1');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [roster, setRoster] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [gridGrades, setGridGrades] = useState({});
  const [batchStatus, setBatchStatus] = useState('');

  // Modal State for New Assignment
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    class_name: 'Science',
    category: 'Homework',
    type: 'Standard',
    points: 100,
    grading_period: 'Quarter 1'
  });

  // Messaging states
  const [recipient, setRecipient] = useState('');
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');

  // Admin states
  const [studentUsername, setStudentUsername] = useState('');
  const [detentionReason, setDetentionReason] = useState('');
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

  useEffect(() => {
    if (user && (user.role === 'staff' || user.role === 'admin')) {
      fetchGradebookGrid();
    }
  }, [selectedClass, selectedGradeLevel, selectedQuarter, selectedCategory, user]);

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
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGradebookGrid = async () => {
    setBatchStatus('');
    try {
      const { data: studentsData } = await supabase
        .from('users')
        .select('*')
        .eq('grade_level', selectedGradeLevel)
        .order('roblox_username', { ascending: true });

      const currentRoster = studentsData || [];
      setRoster(currentRoster);

      let query = supabase
        .from('assignments')
        .select('*')
        .eq('class_name', selectedClass)
        .eq('grading_period', selectedQuarter);

      if (selectedCategory !== 'All Categories') {
        query = query.eq('category', selectedCategory);
      }

      const { data: assignmentsData } = await query;
      const loadedAssignments = assignmentsData || [];
      setAssignments(loadedAssignments);

      if (currentRoster.length === 0 || loadedAssignments.length === 0) {
        setGridGrades({});
        return;
      }

      const studentIds = currentRoster.map(s => s.roblox_id);

      const { data: gradesData } = await supabase
        .from('grades')
        .select('*')
        .eq('subject', selectedClass)
        .in('student_id', studentIds);

      const scoreMap = {};
      (gradesData || []).forEach(g => {
        if (!scoreMap[g.student_id]) scoreMap[g.student_id] = {};
        scoreMap[g.student_id][g.assignment_name] = g.score;
      });
      setGridGrades(scoreMap);

    } catch (err) {
      console.error('Error loading gradebook grid:', err);
    }
  };

  const handleScoreCellChange = (robloxId, assignmentTitle, val) => {
    setGridGrades(prev => ({
      ...prev,
      [robloxId]: {
        ...(prev[robloxId] || {}),
        [assignmentTitle]: val
      }
    }));
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.title.trim()) return;

    try {
      const { error } = await supabase
        .from('assignments')
        .insert([newAssignment]);

      if (error) {
        setBatchStatus('Error creating assignment: ' + error.message);
      } else {
        setShowAssignmentModal(false);
        setNewAssignment({
          ...newAssignment,
          title: '',
          points: 100
        });
        fetchGradebookGrid();
      }
    } catch (err) {
      console.error('Failed to create assignment:', err);
    }
  };

  const handleDeleteAssignment = async (asgn) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${asgn.title}"? This will also delete associated scores.`);
    if (!confirmDelete) return;

    setBatchStatus(`Deleting "${asgn.title}"...`);
    try {
      // 1. Delete associated grades for this assignment
      await supabase
        .from('grades')
        .delete()
        .eq('subject', selectedClass)
        .eq('assignment_name', asgn.title);

      // 2. Delete the assignment itself
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', asgn.id);

      if (error) {
        setBatchStatus('Error deleting assignment: ' + error.message);
      } else {
        setBatchStatus(`Assignment "${asgn.title}" deleted.`);
        fetchGradebookGrid();
      }
    } catch (err) {
      setBatchStatus('Failed to delete assignment.');
    }
  };

  const handleSaveGridGrades = async () => {
    setBatchStatus('Saving scores...');
    try {
      const recordsToUpsert = [];

      for (const student of roster) {
        const studentScores = gridGrades[student.roblox_id] || {};
        for (const asgn of assignments) {
          const scoreVal = studentScores[asgn.title];
          if (scoreVal !== undefined && scoreVal !== '') {
            recordsToUpsert.push({
              student_id: student.roblox_id,
              subject: selectedClass,
              assignment_name: asgn.title,
              score: Number(scoreVal)
            });
          }
        }
      }

      if (recordsToUpsert.length === 0) {
        setBatchStatus('No scores entered to save.');
        return;
      }

      const { error } = await supabase
        .from('grades')
        .upsert(recordsToUpsert, { onConflict: 'student_id, subject, assignment_name' });

      if (error) {
        setBatchStatus('Error saving: ' + error.message);
      } else {
        setBatchStatus('Gradebook updated successfully!');
      }
    } catch (err) {
      setBatchStatus('Failed to save grades.');
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
      setAdminMessage('Error: Student username not found.');
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

  const handleLogout = () => {
    localStorage.removeItem('portal_user');
    router.push('/');
  };

  if (loading || !user) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans text-sm text-gray-600">Loading portal...</div>;
  }

  const isStaffOrAdmin = user.role === 'staff' || user.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 px-8 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-gray-900 cursor-pointer" onClick={() => setActiveTab('home')}>
            Golden Glades
          </span>
          
          <nav className="flex items-center gap-4 text-xs font-semibold tracking-wider text-gray-600 uppercase">
            <button onClick={() => setActiveTab('grades')} className={`hover:text-gray-900 ${activeTab === 'grades' ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-0.5' : ''}`}>
              📝 My Grades
            </button>
            <button onClick={() => setActiveTab('detentions')} className={`hover:text-gray-900 ${activeTab === 'detentions' ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-0.5' : ''}`}>
              👓 Detentions
            </button>
            <button onClick={() => setActiveTab('messages')} className={`hover:text-gray-900 ${activeTab === 'messages' ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-0.5' : ''}`}>
              ✉️ Messages ({messages.length})
            </button>
            {isStaffOrAdmin && (
              <>
                <button onClick={() => setActiveTab('batchGradebook')} className={`hover:text-gray-900 ${activeTab === 'batchGradebook' ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-0.5' : ''}`}>
                  📊 Gradebook
                </button>
                <button onClick={() => setActiveTab('admin')} className={`hover:text-gray-900 ${activeTab === 'admin' ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-0.5' : ''}`}>
                  🛡️ Staff Panel
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-medium uppercase">{user.roblox_username}</span>
          <button onClick={handleLogout} className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded font-semibold transition">
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        
        {/* HOME OVERVIEW */}
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
            <h1 className="text-xl font-bold text-gray-900 mb-1">My Academic Grades</h1>
            <p className="text-xs text-gray-500 mb-6">Course evaluations and academic record for Golden Glades Middle.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CLASSES.map((subj) => {
                const subGrades = grades.filter(g => g.subject.toLowerCase() === subj.toLowerCase());
                const avg = subGrades.length > 0 ? (subGrades.reduce((acc, curr) => acc + Number(curr.score), 0) / subGrades.length).toFixed(1) : 'N/A';

                return (
                  <div key={subj} className="bg-gray-50 p-4 rounded border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-sm text-gray-800">{subj}</h3>
                      <span className="text-xs bg-white text-gray-600 border border-gray-200 px-2 py-0.5 rounded font-semibold">Avg: {avg}%</span>
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

        {/* ASSIGNMENT SCORES GRADEBOOK GRID TAB */}
        {activeTab === 'batchGradebook' && isStaffOrAdmin && (
          <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
            
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl text-gray-800 font-normal">Assignment Scores</h1>
              <button 
                onClick={() => setShowAssignmentModal(true)}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs px-3 py-1.5 rounded shadow-sm transition">
                New Assignment
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <select 
                value={selectedClass} 
                onChange={e => setSelectedClass(e.target.value)}
                className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-500">
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select 
                value={selectedGradeLevel} 
                onChange={e => setSelectedGradeLevel(e.target.value)}
                className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-500">
                {GRADE_LEVELS.map(g => <option key={g} value={g}>{g} Grade</option>)}
              </select>

              <select 
                value={selectedQuarter} 
                onChange={e => setSelectedQuarter(e.target.value)}
                className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-500">
                {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
              </select>

              <select 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-500">
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {batchStatus && (
              <div className="bg-blue-50 border border-blue-200 p-2.5 rounded text-xs text-blue-800 mb-4 flex justify-between items-center">
                <span>{batchStatus}</span>
                <button onClick={() => setBatchStatus('')} className="text-blue-500 hover:text-blue-700 font-bold ml-2">×</button>
              </div>
            )}

            {/* Score Grid */}
            <div className="overflow-x-auto border border-gray-200 rounded">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-600 border-b border-gray-200">
                    <th className="p-3 border-r border-gray-200 min-w-[160px] font-semibold">Student</th>
                    <th className="p-3 border-r border-gray-200 text-center w-28 font-semibold">
                      <div>Overall</div>
                      <div>Grade</div>
                    </th>
                    {assignments.length === 0 ? (
                      <th className="p-3 text-gray-400 italic font-normal">No assignments created yet for {selectedClass} ({selectedQuarter})</th>
                    ) : (
                      assignments.map(asgn => (
                        <th key={asgn.id || asgn.title} className="p-3 border-r border-gray-200 text-center min-w-[140px] font-normal relative group">
                          <div className="flex justify-between items-start gap-1">
                            <div className="truncate max-w-[120px] font-semibold text-gray-800" title={asgn.title}>{asgn.title}</div>
                            <button 
                              onClick={() => handleDeleteAssignment(asgn)}
                              title="Delete Assignment"
                              className="text-gray-300 hover:text-red-600 font-bold text-xs leading-none p-0.5 rounded transition">
                              ×
                            </button>
                          </div>
                          <div className="text-[11px] text-pink-600 border-b border-pink-400 inline-block px-1 mt-0.5">
                            {new Date().toISOString().slice(0, 10).replace(/-/g, '.')}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{asgn.points ? `${asgn.points}.0 pts` : '100.0 pts'}</div>
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {roster.length === 0 ? (
                    <tr>
                      <td colSpan={2 + Math.max(1, assignments.length)} className="p-6 text-center text-gray-400 italic">
                        No students found in {selectedGradeLevel} Grade.
                      </td>
                    </tr>
                  ) : (
                    roster.map(student => {
                      const studentScores = gridGrades[student.roblox_id] || {};
                      const numericScores = assignments
                        .map(a => studentScores[a.title])
                        .filter(s => s !== undefined && s !== '' && !isNaN(s))
                        .map(Number);

                      const overallAvg = numericScores.length > 0 
                        ? (numericScores.reduce((a, b) => a + b, 0) / numericScores.length).toFixed(1) + '%'
                        : '--';

                      return (
                        <tr key={student.roblox_id} className="hover:bg-gray-50/80">
                          <td className="p-3 border-r border-gray-200 font-medium text-gray-800">{student.roblox_username}</td>
                          <td className="p-3 border-r border-gray-200 text-center font-semibold text-gray-600">{overallAvg}</td>
                          {assignments.length === 0 ? (
                            <td className="p-3 text-gray-300 italic">Create an assignment to enter grades</td>
                          ) : (
                            assignments.map(asgn => (
                              <td key={asgn.id || asgn.title} className="p-2 border-r border-gray-200 text-center">
                                <input 
                                  type="text"
                                  placeholder="--"
                                  value={studentScores[asgn.title] ?? ''}
                                  onChange={e => handleScoreCellChange(student.roblox_id, asgn.title, e.target.value)}
                                  className="w-16 border border-pink-300 rounded p-1 text-xs text-center outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-400"
                                />
                              </td>
                            ))
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {roster.length > 0 && assignments.length > 0 && (
              <div className="flex justify-end mt-4">
                <button 
                  onClick={handleSaveGridGrades}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2 rounded transition shadow-sm">
                  Save Scores
                </button>
              </div>
            )}
          </div>
        )}

        {/* STAFF ADMIN TAB */}
        {activeTab === 'admin' && isStaffOrAdmin && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Staff Management Panel</h1>
            <p className="text-xs text-gray-500 mb-6">Issue detentions and administrative notices to students.</p>

            {adminMessage && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-800 mb-6">
                {adminMessage}
              </div>
            )}

            <form onSubmit={handleIssueDetention} className="bg-gray-50 p-4 rounded border border-gray-200 flex flex-col gap-3 max-w-lg">
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
          </div>
        )}

      </main>

      {/* CREATE NEW ASSIGNMENT MODAL */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md shadow-xl max-w-xl w-full border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-base font-bold text-gray-900">Create New Assignment</h2>
              <button onClick={() => setShowAssignmentModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleCreateAssignment} className="p-6 text-xs text-gray-700 space-y-3">
              <div className="grid grid-cols-3 items-center gap-2">
                <label className="font-semibold text-gray-600">Title</label>
                <input 
                  type="text" 
                  value={newAssignment.title} 
                  onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                  required
                  className="col-span-2 border border-gray-300 rounded p-1.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-2">
                <label className="font-semibold text-gray-600">Class</label>
                <select 
                  value={newAssignment.class_name} 
                  onChange={e => setNewAssignment({...newAssignment, class_name: e.target.value})}
                  className="col-span-2 border border-gray-300 rounded p-1.5 outline-none focus:border-blue-500 bg-white">
                  {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 items-center gap-2">
                <label className="font-semibold text-gray-600">Category</label>
                <select 
                  value={newAssignment.category} 
                  onChange={e => setNewAssignment({...newAssignment, category: e.target.value})}
                  className="col-span-2 border border-gray-300 rounded p-1.5 outline-none focus:border-blue-500 bg-white">
                  {CATEGORIES.filter(c => c !== 'All Categories').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 items-center gap-2">
                <label className="font-semibold text-gray-600">Type</label>
                <select 
                  value={newAssignment.type} 
                  onChange={e => setNewAssignment({...newAssignment, type: e.target.value})}
                  className="col-span-2 border border-gray-300 rounded p-1.5 outline-none focus:border-blue-500 bg-white">
                  <option value="Standard">Standard</option>
                  <option value="Extra Credit">Extra Credit</option>
                </select>
              </div>

              <div className="grid grid-cols-3 items-center gap-2">
                <label className="font-semibold text-gray-600">Value (Points)</label>
                <input 
                  type="number" 
                  value={newAssignment.points} 
                  onChange={e => setNewAssignment({...newAssignment, points: Number(e.target.value)})}
                  className="col-span-2 border border-gray-300 rounded p-1.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-2">
                <label className="font-semibold text-gray-600">Grading Period</label>
                <select 
                  value={newAssignment.grading_period} 
                  onChange={e => setNewAssignment({...newAssignment, grading_period: e.target.value})}
                  className="col-span-2 border border-gray-300 rounded p-1.5 outline-none focus:border-blue-500 bg-white">
                  {QUARTERS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAssignmentModal(false)}
                  className="text-gray-500 font-bold uppercase tracking-wider text-[11px] px-3 py-1.5 hover:text-gray-700">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="text-emerald-600 font-bold uppercase tracking-wider text-[11px] px-3 py-1.5 hover:text-emerald-800">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
