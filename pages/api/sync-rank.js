// pages/api/sync-rank.js
import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
  // 1. Restrict to POST requests only
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // 2. Authenticate request using the secret API key header
  const apiKey = req.headers['x-api-key'];
  const expectedSecret = process.env.ROBLOX_SECRET_KEY || 'golden_glades_secure_key_2026';

  if (!apiKey || apiKey !== expectedSecret) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or missing secret key' });
  }

  // 3. Extract Roblox payload
  const { robloxId, username, rankId, roleName } = req.body;

  if (!robloxId || !username) {
    return res.status(400).json({ message: 'Missing required Roblox parameters' });
  }

  try {
    // 4. Upsert user data into Supabase (Insert or Update if roblox_id exists)
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          roblox_id: robloxId,
          roblox_username: username,
          group_rank_id: rankId,
          group_role: roleName,
          verified_at: new Date().toISOString(),
        },
        { onConflict: 'roblox_id' }
      )
      .select();

    if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      success: true,
      message: 'Account rank synced successfully',
      user: data[0],
    });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}