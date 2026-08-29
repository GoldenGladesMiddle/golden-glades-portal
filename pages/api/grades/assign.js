// pages/api/grades/assign.js
import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { studentRobloxId, subject, assignmentName, score } = req.body;

  if (!studentRobloxId || !subject || !assignmentName || score === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('grades')
    .insert([
      {
        student_id: studentRobloxId,
        subject,
        assignment_name: assignmentName,
        score: parseFloat(score),
      },
    ])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, grade: data[0] });
}