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
    console.log('Starting export process');
    const { format } = await c.req.json();
    console.log('Export format requested:', format);
    
    // Get real data from database tables
    const { data: applications, error: appError } = await supabase
      .from('Applications')
      .select('*');
    
    const { data: activityLogs, error: logError } = await supabase
      .from('activity_logs')
      .select('*');
    
    const { data: supportTickets, error: ticketError } = await supabase
      .from('support_tickets')
      .select('*');
    
    const { data: userSettings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*');
    
    const exportData = {
      applications: applications || [],
      activity_logs: activityLogs || [],
      support_tickets: supportTickets || [],
      user_settings: userSettings || [],
      export_date: new Date().toISOString()
    };
    
    // Format data based on requested format
    let responseData;
    let contentType;
    let filename;
    
    switch (format.toLowerCase()) {
      case 'json':
        responseData = JSON.stringify(exportData, null, 2);
        contentType = 'application/json';
        filename = 'user_data.json';
        break;
      case 'csv':
        let csvContent = 'Table,Field,Value\n';
        Object.entries(exportData).forEach(([tableName, records]) => {
          if (Array.isArray(records)) {
            records.forEach((record, index) => {
              Object.entries(record).forEach(([field, value]) => {
                csvContent += `${tableName},${field},"${value}"\n`;
              });
            });
          } else {
            csvContent += `${tableName},export_date,"${records}"\n`;
          }
        });
        responseData = csvContent;
        contentType = 'text/csv';
        filename = 'user_data.csv';
        break;
      case 'excel':
        let excelContent = 'Table\tField\tValue\n';
        Object.entries(exportData).forEach(([tableName, records]) => {
          if (Array.isArray(records)) {
            records.forEach((record, index) => {
              Object.entries(record).forEach(([field, value]) => {
                excelContent += `${tableName}\t${field}\t${value}\n`;
              });
            });
          } else {
            excelContent += `${tableName}\texport_date\t${records}\n`;
          }
        });
        responseData = excelContent;
        contentType = 'application/vnd.ms-excel';
        filename = 'user_data.xls';
        break;
      case 'pdf':
        let pdfContent = 'USER DATA EXPORT\n';
        pdfContent += `Export Date: ${exportData.export_date}\n\n`;
        Object.entries(exportData).forEach(([tableName, records]) => {
          if (Array.isArray(records) && records.length > 0) {
            pdfContent += `${tableName.toUpperCase()}:\n`;
            records.forEach((record, index) => {
              pdfContent += `Record ${index + 1}:\n`;
              Object.entries(record).forEach(([field, value]) => {
                pdfContent += `  ${field}: ${value}\n`;
              });
              pdfContent += '\n';
            });
          }
        });
        responseData = pdfContent;
        contentType = 'application/pdf';
        filename = 'user_data.pdf';
        break;
      default:
        responseData = JSON.stringify(exportData, null, 2);
        contentType = 'application/json';
        filename = 'user_data.json';
    }
    
    console.log('Export successful, returning data');
    return c.json({ 
      success: true, 
      data: responseData,
      contentType,
      filename
    });
  } catch (error) {
    console.error('Export function error:', error);
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