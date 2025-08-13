const { supabase, supabaseAdmin } = require('../supabase');

// Get all accounts from authenticated users
const getAccounts = async (c) => {
  try {
    console.log('Fetching authenticated users...');
    
    // Fetch authenticated users directly
    const { data: authData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    console.log('Auth data:', authData);
    console.log('Users error:', usersError);
    console.log('Number of users:', authData?.users?.length || 0);
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return c.json({ success: false, message: usersError.message }, 500);
    }

    if (!authData?.users || authData.users.length === 0) {
      console.log('No users found');
      return c.json({ success: true, data: [] });
    }

    // Convert authenticated users to account format
    const accounts = authData.users.map(user => {
      console.log('Processing user:', user.email);
      return {
        id: user.id,
        user_id: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Unknown',
        email: user.email,
        role: user.user_metadata?.role || 'Financial Adviser',
        status: 'Active',
        joined_date: user.created_at,
        last_online: user.last_sign_in_at || user.created_at,
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at
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

// Update account role via Supabase Auth
const updateAccount = async (c) => {
  try {
    const id = c.req.param('id');
    const { role } = await c.req.json();
    
    // Update user metadata with new role
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      user_metadata: { role }
    });
    
    if (error) throw error;
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Delete account (disabled - using Supabase Auth directly)
const deleteAccount = async (c) => {
  return c.json({ success: false, message: 'Account deletion handled by Supabase Auth' }, 400);
};

module.exports = { getAccounts, createAccount, updateAccount, deleteAccount };