const { supabase, supabaseAdmin } = require('../supabase');

// Get user settings
const getUserSettings = async (c) => {
  try {
    const userId = c.req.header('user-id'); // Get from auth middleware
    
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    // Return default settings if none exist
    const defaultSettings = {
      email_notifications: false,
      sms_notifications: false,
      two_factor_enabled: false,
      language: 'English'
    };
    
    return c.json({ 
      success: true, 
      data: data || defaultSettings 
    });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Update user settings
const updateUserSettings = async (c) => {
  try {
    const userId = c.req.header('user-id');
    const settings = await c.req.json();
    
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Change password
const changePassword = async (c) => {
  try {
    const userId = c.req.header('user-id');
    const { currentPassword, newPassword } = await c.req.json();
    
    // Update password using Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword
    });
    
    if (error) throw error;
    
    return c.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Export user data
const exportUserData = async (c) => {
  try {
    const userId = c.req.header('user-id');
    const { format } = await c.req.json();
    
    // Get user data from auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (userError) throw userError;
    
    // Get user settings
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    // Get user profile if exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    const exportData = {
      user: {
        id: userData.user.id,
        email: userData.user.email,
        created_at: userData.user.created_at,
        last_sign_in_at: userData.user.last_sign_in_at
      },
      profile: profile || {},
      settings: settings || {}
    };
    
    // Format data based on requested format
    let responseData;
    let contentType;
    
    switch (format.toLowerCase()) {
      case 'json':
        responseData = JSON.stringify(exportData, null, 2);
        contentType = 'application/json';
        break;
      case 'csv':
        // Simple CSV conversion
        const csvData = Object.entries(exportData.user)
          .map(([key, value]) => `${key},${value}`)
          .join('\n');
        responseData = csvData;
        contentType = 'text/csv';
        break;
      default:
        responseData = JSON.stringify(exportData, null, 2);
        contentType = 'application/json';
    }
    
    return c.json({ 
      success: true, 
      data: responseData,
      contentType,
      filename: `user_data_${userId}.${format.toLowerCase()}`
    });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Submit support ticket
const submitSupportTicket = async (c) => {
  try {
    const { issueType, priority, description } = await c.req.json();
    
    console.log('Submitting ticket to database:', { issueType, priority, description });
    
    const { data, error } = await supabaseAdmin
      .from('support_tickets')
      .insert({
        user_id: null, // Allow null for anonymous tickets
        issue_type: issueType,
        priority: priority,
        description: description,
        status: 'Open',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Database error:', error);
      throw error;
    }
    
    console.log('Ticket created successfully:', data);
    
    return c.json({ 
      success: true, 
      data,
      message: 'Support ticket submitted successfully and saved to database' 
    });
  } catch (error) {
    console.error('Support ticket error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Get user support tickets
const getUserTickets = async (c) => {
  try {
    const userId = c.req.header('user-id');
    
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

module.exports = {
  getUserSettings,
  updateUserSettings,
  changePassword,
  exportUserData,
  submitSupportTicket,
  getUserTickets
};