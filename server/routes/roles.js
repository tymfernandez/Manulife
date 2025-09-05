const { supabase } = require('../supabase');

const getUserRole = async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, message: 'Not authenticated' }, 401);
    }

    const token = authHeader.substring(7);
    const { supabaseAdmin } = require('../supabase');
    
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return c.json({ success: false, message: 'Invalid token' }, 401);
    }

    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      return c.json({ success: true, role: 'FA' });
    }

    if (!data) {
      return c.json({ success: true, role: 'FA' });
    }

    return c.json({ success: true, role: data.role || 'FA' });
  } catch (error) {
    return c.json({ success: true, role: 'FA' });
  }
};

module.exports = { getUserRole };