import { createClient } from '@supabase/supabase-js';

// Initialize admin client with service_role key to bypass RLS for server operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = req.headers['x-api-key'];
  const expectedSecret = process.env.ROBLOX_SECRET_KEY || 'golden_glades_secure_key_2026';

  if (!apiKey || apiKey !== expectedSecret) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or missing secret key' });
  }

  const body = req.body || {};
  const robloxId = body.robloxId || body.roblox_id || body.userId;
  const username = body.username || body.roblox_username || body.name;
  const rankId = Number(body.rankId || body.group_rank || body.rank || 0);
  const roleName = body.roleName || body.group_role || body.role || 'Guest';

  if (!robloxId || !username) {
    return res.status(400).json({ message: 'Missing required Roblox parameters' });
  }

  // Determine portal role based on Roblox group rank ID
  let portalRole = 'student';
  if (rankId >= 140 && rankId <= 255) {
    portalRole = 'admin';
  } else if (rankId >= 65 && rankId <= 131) {
    portalRole = 'staff';
  } else {
    portalRole = 'student';
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          roblox_id: Number(robloxId),
          roblox_username: String(username).trim(),
          group_rank: rankId,
          group_role_name: String(roleName),
          role: portalRole,
          updated_at: new Date().toISOString(),
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
      message: 'Account rank and portal role synced successfully',
      user: data?.[0] || null,
    });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}