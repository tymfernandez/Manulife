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

    // Try to get role from user_profiles using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching role:', error);
      return c.json({ success: true, role: 'FA' });
    }

    // If no profile exists, create one with FA role
    if (!data) {
      const { error: insertError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: user.id,
          email: user.email,
          role: 'FA'
        });
      
      if (insertError) {
        console.error('Error creating profile:', insertError);
      }
      
      return c.json({ success: true, role: 'FA' });
    }

    return c.json({ success: true, role: data.role || 'FA' });
  } catch (error) {
    console.error('Role fetch error:', error);
    return c.json({ success: true, role: 'FA' });
  }
};

module.exports = { getUserRole };