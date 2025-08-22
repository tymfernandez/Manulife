const { supabase } = require('../supabase');

const getRecruits = async (c) => {
  try {
    const { supabaseAdmin } = require('../supabase');
    
    // Get current user's session and role
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return c.json({ success: false, message: 'Not authenticated' }, 401);
    }

    // Get user's role
    const { data: userProfile, error: roleError } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (roleError) {
      console.log('Role error, showing all data:', roleError);
      // Fallback: show all data if can't get role
      const { data, error } = await supabaseAdmin
        .from('Applications')
        .select(`
          *,
          user_profiles(
            id,
            email,
            full_name,
            role
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return c.json({ success: true, data });
    }

    const userRole = userProfile.role;
    console.log('User role:', userRole);

    // Define what roles each user can see (using full position names)
    const roleHierarchy = {
      'BH': ['Unit Head'], 
      'UH': ['Unit Head Associate', 'Financial Advisor'], 
      'UHA': ['Financial Advisor'], 
      'Region Head': ['Branch Head', 'Unit Head', 'Unit Head Associate', 'Financial Advisor'], 
      'Sys Admin': ['Branch Head', 'Unit Head', 'Unit Head Associate', 'Financial Advisor'], 
      'FA': [] // FA can't see recruitment data
    };

    const allowedRoles = roleHierarchy[userRole];
    console.log('Allowed roles:', allowedRoles);

    // If no role hierarchy defined, show all data
    if (!allowedRoles) {
      console.log('No hierarchy found, showing all data');
      const { data, error } = await supabaseAdmin
        .from('Applications')
        .select(`
          *,
          user_profiles(
            id,
            email,
            full_name,
            role
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return c.json({ success: true, data });
    }

    // If empty array (like FA), return no data
    if (allowedRoles.length === 0) {
      return c.json({ success: true, data: [] });
    }

    // Fetch applications with user info, filtered by position
    const { data, error } = await supabaseAdmin
      .from('Applications')
      .select(`
        *,
        user_profiles!inner(
          id,
          email,
          full_name,
          role
        )
      `)
      .in('position_applied_for', allowedRoles)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    console.log('Filtered results:', data?.length || 0, 'records');
    
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

const updateRecruit = async (c) => {
  try {
    const id = c.req.param('id');
    const recruitData = await c.req.json();
    
    const { data, error } = await supabase
      .from('Applications')
      .update({
        full_name: recruitData.fullName,
        email_address: recruitData.email,
        position_applied_for: recruitData.position,
        status: recruitData.status,
        referral_name: recruitData.referralName,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    return c.json({ success: true, data: data?.[0] || {} });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

const deleteRecruit = async (c) => {
  try {
    const id = c.req.param('id');
    console.log('Deleting recruit with ID:', id);
    
    const { data, error } = await supabase
      .from('Applications')
      .delete()
      .eq('id', id)
      .select();
    
    console.log('Delete result:', { data, error });
    
    if (error) throw error;
    
    return c.json({ success: true, deleted: data });
  } catch (error) {
    console.error('Delete error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
};

const getRecruitsWithDetails = async (c) => {
  try {
    const { data, error } = await supabase
      .from('Applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

const getApplicationsWithRecruitment = async (c) => {
  try {
    const { data, error } = await supabase
      .from('Applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

module.exports = { 
  getRecruits, 
  updateRecruit, 
  deleteRecruit, 
  getRecruitsWithDetails, 
  getApplicationsWithRecruitment 
};