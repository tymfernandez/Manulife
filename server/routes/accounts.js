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

// Create new account using Supabase Auth admin
const createAccount = async (c) => {
  try {
    const { email, password, full_name, role } = await c.req.json();
    
    console.log('createAccount called with:', { email, full_name, role });
    
    if (!supabaseAdmin) {
      throw new Error('Admin access not configured');
    }
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name,
        role
      }
    });
    
    if (authError) {
      console.error('Error creating auth user:', authError);
      throw authError;
    }
    
    // Create user profile (this might be handled by database triggers)
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .upsert({
        id: authData.user.id,
        email: email,
        full_name: full_name,
        role: role || 'FA'
      })
      .select()
      .single();
    
    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Don't throw here as the auth user was created successfully
    }
    
    console.log('Account created successfully:', authData.user.id);
    return c.json({ 
      success: true, 
      data: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: full_name,
        role: role || 'FA'
      }
    });
  } catch (error) {
    console.error('createAccount error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
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

// Delete account using Supabase Auth admin
const deleteAccount = async (c) => {
  try {
    const id = c.req.param('id');
    
    console.log('deleteAccount called with id:', id);
    
    if (!supabaseAdmin) {
      throw new Error('Admin access not configured');
    }
    
    // First, try to delete the user from auth (this will cascade to user_profiles due to FK constraint)
    const { data: deleteData, error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id);
    
    if (deleteError) {
      console.error('Error deleting auth user:', deleteError);
      // If auth deletion fails, try to delete just the profile
      const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .delete()
        .eq('id', id);
      
      if (profileError) {
        console.error('Error deleting user profile:', profileError);
        throw new Error('Failed to delete account');
      }
    }
    
    console.log('Account deleted successfully:', id);
    return c.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    console.error('deleteAccount error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
};

module.exports = { getAccounts, createAccount, updateAccount, deleteAccount };