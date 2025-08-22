const { supabase } = require('../supabase');

const getUserRole = async (c) => {
  try {
    const { supabaseAdmin } = require('../supabase');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return c.json({ success: false, message: 'Not authenticated' }, 401);
    }

    // Try to get role from user_profiles using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle(); // Use maybeSingle instead of single

    if (error) {
      console.error('Error fetching role:', error);
      return c.json({ success: true, role: 'FA' }); // Default to FA
    }

    // If no profile exists, create one with FA role
    if (!data) {
      const { error: insertError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          id: session.user.id,
          email: session.user.email,
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
    return c.json({ success: true, role: 'Sys Admin' }); // Default fallback
  }
};

module.exports = { getUserRole };