import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const CLASSES = [
  'Science',
  'Culinary Arts',
  'English',
  'Theatre',
  'Gym',
  'History',
  'Art',
  'Speech & Debate'
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

  // Dropdown menu state
  const [activeMenuAssignmentId, setActiveMenuAssignmentId] = useState(null);

  // Modal State for New/Edit Assignment
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState(null);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    class_name: 'Science',
    category: 'Homework',
    type: 'Standard',
    points: 100,
    grading_period: 'Quarter 1'
  });

  // Students Tab State
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilterGrade, setStudentFilterGrade] = useState('All Students');

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

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuAssignmentId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
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
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGradebookGrid = async () => {
    setBatchStatus('');
    try {
      let queryRoster = supabase
        .from('users')
        .select('*')
        .order('roblox_username', { ascending: true });

      if (selectedGradeLevel !== 'All') {
        queryRoster = queryRoster.eq('grade_level', selectedGradeLevel);
      }

      const { data: studentsData } = await queryRoster;
      const currentRoster = studentsData || [];
      setRoster(currentRoster);

      let queryAsgn = supabase
        .from('assignments')
        .select('*')
        .eq('class_name', selectedClass)
        .eq('grading_period', selectedQuarter);

      if (selectedCategory !== 'All Categories') {
        queryAsgn = queryAsgn.eq('category', selectedCategory);
      }

      const { data: assignmentsData } = await queryAsgn;
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

  const openNewAssignmentModal = () => {
    setEditingAssignmentId(null);
    setNewAssignment({
      title: '',
      class_name: selectedClass,
      category: 'Homework',
      type: 'Standard',
      points: 100,
      grading_period: selectedQuarter
    });
    setShowAssignmentModal(true);
  };

  const handleEditAssignmentModal = (asgn) => {
    setEditingAssignmentId(asgn.id);
    setNewAssignment({
      title: asgn.title,
      class_name: asgn.class_name || selectedClass,
      category: asgn.category || 'Homework',
      type: asgn.type || 'Standard',
      points: asgn.points || 100,
      grading_period: asgn.grading_period || selectedQuarter
    });
    setShowAssignmentModal(true);
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.title.trim()) return;

    try {
      if (editingAssignmentId) {
        const { error } = await supabase
          .from('assignments')
          .update(newAssignment)
          .eq('id', editingAssignmentId);

        if (error) {
          setBatchStatus('Error updating assignment: ' + error.message);
        } else {
          setBatchStatus(`Assignment updated.`);
        }
      } else {
        const { error } = await supabase
          .from('assignments')
          .insert([newAssignment]);

        if (error) {
          setBatchStatus('Error creating assignment: ' + error.message);
        } else {
          setBatchStatus(`Assignment created.`);
        }
      }

      setShowAssignmentModal(false);
      setEditingAssignmentId(null);
      fetchGradebookGrid();
    } catch (err) {
      console.error('Failed to save assignment:', err);
    }
  };

  const handleDeleteAssignment = async (asgn) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${asgn.title}"? This will also delete associated student scores.`);
    if (!confirmDelete) return;

    setBatchStatus(`Deleting "${asgn.title}"...`);
    try {
      await supabase
        .from('grades')
        .delete()
        .eq('subject', selectedClass)
        .eq('assignment_name', asgn.title);

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

  const handleBulkUpdateScores = (asgn) => {
    const scoreVal = window.prompt(`Enter a score (0-${asgn.points || 100}) to apply to ALL students for "${asgn.title}":`);
    if (scoreVal === null || scoreVal.trim() === '') return;

    const numericVal = Number(scoreVal);
    if (isNaN(numericVal)) {
      alert('Please enter a valid number.');
      return;
    }

    setGridGrades(prev => {
      const updated = { ...prev };
      roster.forEach(student => {
        updated[student.roblox_id] = {
          ...(updated[student.roblox_id] || {}),
          [asgn.title]: numericVal
        };
      });
      return updated;
    });

    setBatchStatus(`Applied ${numericVal}% to "${asgn.title}" for all students. Remember to click Save Scores!`);
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

  const filteredStudents = roster.filter(s => 
    s.roblox_username.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col font-sans">
      
      {/* Primary Top Navbar */}
      <header className="bg-white border-b border-gray-200 px-8 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-6">
          <span className="text-xl font-bold text-gray-900 cursor-pointer" onClick={() => setActiveTab('home')}>
            Golden Glades
          </span>
          
          <nav className="flex items-center gap-4 text-xs font-semibold tracking-wider text-gray-600 uppercase">
            <button onClick={() => setActiveTab('home')} className={`hover:text-gray-900 ${activeTab === 'home' ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-0.5' : ''}`}>
              🏠 Home
            </button>
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
              <button onClick={() => setActiveTab('admin')} className={`hover:text-gray-900 ${activeTab === 'admin' ? 'text-gray-900 font-bold border-b-2 border-gray-900 pb-0.5' : ''}`}>
                🛡️ Staff Panel
              </button>
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

      {/* Gradebook Green Sub-Navbar for Staff / Admins */}
      {isStaffOrAdmin && (
        <div className="bg-[#a4cf53] px-8 py-2.5 flex items-center gap-8 shadow-inner border-b border-[#92bd44]">
          <button 
            onClick={() => setActiveTab('home')}
            className={`text-sm font-semibold transition ${activeTab === 'home' ? 'text-white font-bold' : 'text-[#385507] hover:text-white'}`}>
            Home
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`text-sm font-semibold transition ${activeTab === 'students' ? 'text-white font-bold' : 'text-[#385507] hover:text-white'}`}>
            Students
          </button>
          <button 
            onClick={() => setActiveTab('classes')}
            className={`text-sm font-semibold transition ${activeTab === 'classes' ? 'text-white font-bold' : 'text-[#385507] hover:text-white'}`}>
            Classes
          </button>
          <button 
            onClick={() => setActiveTab('batchGradebook')}
            className={`text-sm font-semibold transition ${activeTab === 'batchGradebook' ? 'text-white font-bold' : 'text-[#385507] hover:text-white'}`}>
            Assignments
          </button>
          <button 
            onClick={() => setActiveTab('attendance')}
            className={`text-sm font-semibold transition ${activeTab === 'attendance' ? 'text-white font-bold' : 'text-[#385507] hover:text-white'}`}>
            Attendance
          </button>
        </div>
      )}

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

        {/* STUDENTS TAB (ID Number = UserID, GPA included, Gender & Email removed) */}
        {activeTab === 'students' && isStaffOrAdmin && (
          <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
            <h1 className="text-xl text-gray-800 font-normal mb-4">Students</h1>

            {/* Top Search & Filter Bar */}
            <div className="flex items-center gap-3 mb-6">
              <select 
                value={studentFilterGrade}
                onChange={e => setStudentFilterGrade(e.target.value)}
                className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-500">
                <option value="All Students">All Students</option>
                {GRADE_LEVELS.map(g => <option key={g} value={g}>{g} Grade</option>)}
              </select>

              <div className="relative flex-1 max-w-sm">
                <input 
                  type="text"
                  placeholder="Search students..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-500 pr-8"
                />
                {studentSearch && (
                  <button 
                    onClick={() => setStudentSearch('')} 
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold">
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto border border-gray-200 rounded">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-600 border-b border-gray-200">
                    <th className="p-3 border-r border-gray-200 font-semibold">Student</th>
                    <th className="p-3 border-r border-gray-200 font-semibold text-center">ID Number</th>
                    <th className="p-3 border-r border-gray-200 font-semibold text-center">GPA</th>
                    <th className="p-3 font-semibold text-center w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-gray-400 italic">
                        No students found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => (
                      <tr key={student.roblox_id} className="hover:bg-gray-50/80">
                        <td className="p-3 border-r border-gray-200 font-medium text-blue-600 hover:underline cursor-pointer">
                          {student.roblox_username}
                        </td>
                        <td className="p-3 border-r border-gray-200 text-center text-gray-600 font-mono">
                          {student.roblox_id}
                        </td>
                        <td className="p-3 border-r border-gray-200 text-center font-semibold text-gray-800">
                          {student.gpa ? Number(student.gpa).toFixed(2) : '4.00'}
                        </td>
                        <td className="p-3 text-center text-gray-400 hover:text-gray-700 cursor-pointer">
                          •••
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CLASSES TAB */}
        {activeTab === 'classes' && isStaffOrAdmin && (
          <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
            <h1 className="text-xl text-gray-800 font-normal mb-4">Classes Directory</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CLASSES.map(cls => (
                <div key={cls} className="bg-gray-50 border border-gray-200 p-4 rounded hover:border-gray-300 transition">
                  <h3 className="font-bold text-sm text-gray-800 mb-1">{cls}</h3>
                  <p className="text-xs text-gray-500">Golden Glades Middle School Curriculum</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && isStaffOrAdmin && (
          <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl text-gray-800 font-normal">Attendance Log</h1>
              <div className="flex gap-2">
                <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs px-3 py-1.5 rounded shadow-sm">Take Attendance</button>
                <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs px-3 py-1.5 rounded shadow-sm">Options</button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <select className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800">
                <option>Day Summary</option>
              </select>
              <select className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800">
                <option>Overall</option>
              </select>
              <select className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800">
                <option>All Classes</option>
              </select>
              <select className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800">
                <option>All Students</option>
              </select>
            </div>

            <div className="border border-gray-200 rounded overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-600">
                    <th className="p-3 border-r border-gray-200">Date</th>
                    <th className="p-3 border-r border-gray-200 text-center"><span className="inline-block w-2.5 h-2.5 bg-red-500 mr-1 rounded-xs"></span>U</th>
                    <th className="p-3 border-r border-gray-200 text-center"><span className="inline-block w-2.5 h-2.5 bg-emerald-500 mr-1 rounded-xs"></span>A</th>
                    <th className="p-3 border-r border-gray-200 text-center"><span className="inline-block w-2.5 h-2.5 bg-yellow-400 mr-1 rounded-xs"></span>TU</th>
                    <th className="p-3 border-r border-gray-200 text-center"><span className="inline-block w-2.5 h-2.5 bg-green-500 mr-1 rounded-xs"></span>T</th>
                    <th className="p-3 border-r border-gray-200 text-center"><span className="inline-block w-2.5 h-2.5 bg-gray-500 mr-1 rounded-xs"></span>ENT</th>
                    <th className="p-3 border-r border-gray-200 text-center"><span className="inline-block w-2.5 h-2.5 bg-gray-600 mr-1 rounded-xs"></span>WD</th>
                    <th className="p-3 text-center"><span className="inline-block w-2.5 h-2.5 bg-blue-500 mr-1 rounded-xs"></span>NS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr className="bg-gray-50/50 font-semibold">
                    <td className="p-3 border-r border-gray-200">Overall Totals</td>
                    <td className="p-3 border-r border-gray-200 text-center bg-red-100/60 text-red-700">8</td>
                    <td className="p-3 border-r border-gray-200 text-center">0</td>
                    <td className="p-3 border-r border-gray-200 text-center bg-yellow-100/60 text-yellow-800">6</td>
                    <td className="p-3 border-r border-gray-200 text-center">0</td>
                    <td className="p-3 border-r border-gray-200 text-center bg-gray-200 text-gray-800">37</td>
                    <td className="p-3 border-r border-gray-200 text-center">0</td>
                    <td className="p-3 text-center bg-blue-100/60 text-blue-800">12</td>
                  </tr>
                  {['2026.08.29 (Sat)', '2026.08.28 (Fri)', '2026.08.27 (Thu)', '2026.08.26 (Wed)'].map(date => (
                    <tr key={date} className="hover:bg-gray-50">
                      <td className="p-3 border-r border-gray-200">{date}</td>
                      <td className="p-3 border-r border-gray-200 text-center">0</td>
                      <td className="p-3 border-r border-gray-200 text-center">0</td>
                      <td className="p-3 border-r border-gray-200 text-center">0</td>
                      <td className="p-3 border-r border-gray-200 text-center">0</td>
                      <td className="p-3 border-r border-gray-200 text-center">0</td>
                      <td className="p-3 border-r border-gray-200 text-center">0</td>
                      <td className="p-3 text-center">0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                onClick={openNewAssignmentModal}
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
            <div className="overflow-x-auto border border-gray-200 rounded min-h-[300px]">
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
                        <th key={asgn.id || asgn.title} className="p-3 border-r border-gray-200 text-center min-w-[160px] font-normal relative">
                          {/* Interactive Header Title */}
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuAssignmentId(activeMenuAssignmentId === asgn.id ? null : asgn.id);
                            }}
                            className="cursor-pointer hover:bg-gray-200/60 p-1 rounded transition flex flex-col items-center">
                            <div className="truncate max-w-[140px] font-semibold text-gray-800 hover:text-blue-600" title={asgn.title}>
                              {asgn.title}
                            </div>
                            <div className="text-[11px] text-purple-600 border-b border-purple-400 inline-block px-1 mt-0.5">
                              {new Date(asgn.created_at || Date.now()).toISOString().slice(0, 10).replace(/-/g, '.')}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">{asgn.points ? `${asgn.points}.0 pts` : '100.0 pts'}</div>
                          </div>

                          {/* Assignment Context Dropdown Menu */}
                          {activeMenuAssignmentId === asgn.id && (
                            <div 
                              onClick={(e) => e.stopPropagation()}
                              className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-44 bg-white border border-gray-200 shadow-xl rounded-md py-1 z-50 text-left">
                              <button 
                                onClick={() => {
                                  setActiveMenuAssignmentId(null);
                                  handleEditAssignmentModal(asgn);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                ✏️ Edit Assignment
                              </button>
                              <button 
                                onClick={() => {
                                  setActiveMenuAssignmentId(null);
                                  handleBulkUpdateScores(asgn);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                📝 Bulk Update Scores
                              </button>
                              <div className="border-t border-gray-100 my-1"></div>
                              <button 
                                onClick={() => {
                                  setActiveMenuAssignmentId(null);
                                  handleDeleteAssignment(asgn);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium">
                                🗑️ Delete Assignment
                              </button>
                            </div>
                          )}
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

      {/* CREATE / EDIT ASSIGNMENT MODAL */}
      {showAssignmentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-md shadow-xl max-w-xl w-full border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-base font-bold text-gray-900">
                {editingAssignmentId ? 'Edit Assignment' : 'Create New Assignment'}
              </h2>
              <button onClick={() => setShowAssignmentModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">×</button>
            </div>

            <form onSubmit={handleSaveAssignment} className="p-6 text-xs text-gray-700 space-y-3">
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
