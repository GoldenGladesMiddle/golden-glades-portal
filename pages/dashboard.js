import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';

const CLASSES = [
  'Social Studies Grade 5',
  'Art',
  'Culinary Arts',
  'English',
  'Gym',
  'History',
  'Science',
  'Speech & Debate',
  'Theatre'
];

const QUARTERS = ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'];
const CATEGORIES = ['All Categories', 'Homework', 'Quizzes', 'Tests', 'Projects'];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);

  // Data states
  const [grades, setGrades] = useState([]);
  const [detentions, setDetentions] = useState([]);
  const [messages, setMessages] = useState([]);

  // Gradebook Grid states (Staff/Admin)
  const [selectedClass, setSelectedClass] = useState('Social Studies Grade 5');
  const [selectedQuarter, setSelectedQuarter] = useState('Quarter 1');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [roster, setRoster] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [gridGrades, setGridGrades] = useState({});
  const [batchStatus, setBatchStatus] = useState('');

  // Modal State for "New Assignment"
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    class_name: 'Social Studies Grade 5',
    category: 'Homework',
    type: 'Standard',
    points: 100,
    counts: true,
    date_assigned: '',
    date_due: '',
    grading_period: 'Quarter 1',
    grade_scale: 'Same as Class',
    share_on_portals: true,
    enable_uploads: true
  });

  // Messaging & Admin states
  const [recipient, setRecipient] = useState('');
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');
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
  }, [selectedClass, selectedQuarter, selectedCategory, user]);

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
      // Load enrolled students
      const { data: studentsData } = await supabase
        .from('users')
        .select('*')
        .order('roblox_username', { ascending: true });

      const currentRoster = studentsData || [];
      setRoster(currentRoster);

      // Load assignments created for this class/quarter
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

      // Fetch grade records
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
            <button onClick={() => setActiveTab('grades')} className={`hover:text-gray-900 ${activeTab === 'grades' ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : ''}`}>
              📝 My Grades
            </button>
            <button onClick={() => setActiveTab('detentions')} className={`hover:text-gray-900 ${activeTab === 'detentions' ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : ''}`}>
              👓 Detentions
            </button>
            <button onClick={() => setActiveTab('messages')} className={`hover:text-gray-900 ${activeTab === 'messages' ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : ''}`}>
              ✉️ Messages ({messages.length})
            </button>
            {isStaffOrAdmin && (
              <>
                <button onClick={() => setActiveTab('batchGradebook')} className={`hover:text-gray-900 ${activeTab === 'batchGradebook' ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : ''}`}>
                  📊 Gradebook
                </button>
                <button onClick={() => setActiveTab('admin')} className={`hover:text-gray-900 ${activeTab === 'admin' ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5' : ''}`}>
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
        
        {/* ASSIGNMENT SCORES GRADEBOOK GRID TAB */}
        {activeTab === 'batchGradebook' && isStaffOrAdmin && (
          <div className="bg-white rounded border border-gray-200 shadow-sm p-6">
            
            {/* Header Title & New Assignment Button */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl text-gray-800 font-normal">Assignment Scores</h1>
              <button 
                onClick={() => setShowAssignmentModal(true)}
                className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs px-3 py-1.5 rounded shadow-sm transition">
                New Assignment
              </button>
            </div>

            {/* Filters Row */}
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <select 
                value={selectedClass} 
                onChange={e => setSelectedClass(e.target.value)}
                className="bg-white border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-blue-500">
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
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
              <div className="bg-blue-50 border border-blue-200 p-2.5 rounded text-xs text-blue-800 mb-4">
                {batchStatus}
              </div>
            )}

            {/* Score Table */}
            <div className="overflow-x-auto border border-gray-200 rounded">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-600 border-b border-gray-200">
                    <th className="p-3 border-r border-gray-200 min-w-[160px] font-semibold">Student</th>
                    <th className="p-3 border-r border-gray-200 text-center w-28 font-semibold">
                      <div>Overall</div>
                      <div>Grade</div>
                    </th>
                    {assignments.map(asgn => (
                      <th key={asgn.id || asgn.title} className="p-3 border-r border-gray-200 text-center min-w-[140px] font-normal">
                        <div className="truncate max-w-[150px] font-semibold text-gray-800" title={asgn.title}>{asgn.title}</div>
                        <div className="text-[11px] text-pink-600 border-b border-pink-400 inline-block px-1 mt-0.5">
                          {asgn.date_due || '2026.08.21'}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{asgn.points ? `${asgn.points}.0 pts` : '100.0 pts'}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {roster.map(student => {
                    const studentScores = gridGrades[student.roblox_id] || {};
                    return (
                      <tr key={student.roblox_id} className="hover:bg-gray-50/80">
                        <td className="p-3 border-r border-gray-200 font-medium text-gray-800">{student.roblox_username}</td>
                        <td className="p-3 border-r border-gray-200 text-center font-semibold text-gray-600">
                          {/* Aggregate display */}
                          --
                        </td>
                        {assignments.map(asgn => (
                          <td key={asgn.id || asgn.title} className="p-2 border-r border-gray-200 text-center">
                            <input 
                              type="text"
                              placeholder="--"
                              value={studentScores[asgn.title] ?? ''}
                              onChange={e => handleScoreCellChange(student.roblox_id, asgn.title, e.target.value)}
                              className="w-16 border border-pink-300 rounded p-1 text-xs text-center outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-400"
                            />
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <button 
                onClick={handleSaveGridGrades}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 py-2 rounded transition shadow-sm">
                Save Scores
              </button>
            </div>
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

              <div className="grid grid-cols-3 items-center gap-2">
                <label className="font-semibold text-gray-600">Counts?</label>
                <button 
                  type="button"
                  onClick={() => setNewAssignment({...newAssignment, counts: !newAssignment.counts})}
                  className="text-left font-semibold text-emerald-600 underline">
                  {newAssignment.counts ? 'Yes' : 'No'}
                </button>
              </div>

              <div className="grid grid-cols-3 items-center gap-2">
                <label className="font-semibold text-gray-600">Share on Portals?</label>
                <button 
                  type="button"
                  onClick={() => setNewAssignment({...newAssignment, share_on_portals: !newAssignment.share_on_portals})}
                  className="text-left font-semibold text-emerald-600 underline">
                  {newAssignment.share_on_portals ? 'Yes' : 'No'}
                </button>
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
