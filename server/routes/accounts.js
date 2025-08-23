const { supabase, supabaseAdmin } = require('../supabase');

// Get all accounts from user_profiles table
const getAccounts = async (c) => {
  try {
    console.log('Fetching user profiles...');
    
    // Fetch user profiles with auth user data joined
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (profilesError) {
      console.error('Error fetching user profiles:', profilesError);
      return c.json({ success: false, message: profilesError.message }, 500);
    }

    if (!profiles || profiles.length === 0) {
      console.log('No user profiles found');
      return c.json({ success: true, data: [] });
    }

    // Get auth user data to supplement profile data
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Error fetching auth users:', authError);
      // Continue with just profile data if auth fetch fails
    }

    // Create a map of auth users for quick lookup
    const authUsersMap = {};
    if (authData?.users) {
      authData.users.forEach(user => {
        authUsersMap[user.id] = user;
      });
    }

    // Convert user profiles to account format
    const accounts = profiles.map(profile => {
      const authUser = authUsersMap[profile.id];
      console.log('Processing profile:', profile.email);
      
      return {
        id: profile.id,
        user_id: profile.id,
        name: profile.full_name || profile.first_name || profile.email?.split('@')[0] || 'Unknown',
        email: profile.email,
        role: profile.role || 'FA',
        status: authUser ? 'Active' : 'Inactive',
        joined_date: profile.created_at || authUser?.created_at,
        last_online: authUser?.last_sign_in_at || profile.created_at || authUser?.created_at,
        created_at: profile.created_at || authUser?.created_at,
        updated_at: profile.updated_at || authUser?.updated_at || profile.created_at || authUser?.created_at
      };
    });
    
    console.log('Returning accounts:', accounts.length);
    return c.json({ success: true, data: accounts });
  } catch (error) {
    console.error('getAccounts error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Create new account (disabled - using Supabase Auth directly)
const createAccount = async (c) => {
  return c.json({ success: false, message: 'Account creation handled by Supabase Auth' }, 400);
};

// Update account role via user_profiles table
const updateAccount = async (c) => {
  try {
    const id = c.req.param('id');
    const { role } = await c.req.json();
    
    console.log('updateAccount called with id:', id, 'role:', role);
    
    // Update role in user_profiles table
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update({ role })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error updating role:', error);
      throw error;
    }
    
    console.log('Role updated successfully:', data);
    return c.json({ success: true, data });
  } catch (error) {
    console.error('updateAccount error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Delete account (disabled - using Supabase Auth directly)
const deleteAccount = async (c) => {
  return c.json({ success: false, message: 'Account deletion handled by Supabase Auth' }, 400);
};

module.exports = { getAccounts, createAccount, updateAccount, deleteAccount };