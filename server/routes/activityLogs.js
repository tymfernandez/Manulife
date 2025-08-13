const { supabase } = require('../supabase');

const getActivityLogs = async (c) => {
  try {
    const { page = 1, limit = 10, search = '', role = '', activityType = '', dateFrom = '', dateTo = '' } = c.req.query();
    
    let query = supabase
      .from('activity_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`user_name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (role) {
      query = query.eq('user_role', role);
    }
    
    if (activityType) {
      query = query.eq('activity_type', activityType);
    }
    
    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }
    
    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    // Apply pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching activity logs:', error);
      return c.json({ success: false, message: error.message }, 500);
    }

    return c.json({
      success: true,
      data: data || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error in getActivityLogs:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
};

const createActivityLog = async (c) => {
  try {
    const body = await c.req.json();
    const { user_id, user_name, user_role, activity_type, description } = body;

    if (!user_name || !user_role || !activity_type || !description) {
      return c.json({ 
        success: false, 
        message: 'Missing required fields: user_name, user_role, activity_type, description' 
      }, 400);
    }

    const { data, error } = await supabase
      .from('activity_logs')
      .insert([{
        user_id,
        user_name,
        user_role,
        activity_type,
        description
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating activity log:', error);
      return c.json({ success: false, message: error.message }, 500);
    }

    return c.json({ success: true, data });
  } catch (error) {
    console.error('Error in createActivityLog:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
};

const deleteActivityLog = async (c) => {
  try {
    const { id } = c.req.param();

    const { error } = await supabase
      .from('activity_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting activity log:', error);
      return c.json({ success: false, message: error.message }, 500);
    }

    return c.json({ success: true, message: 'Activity log deleted successfully' });
  } catch (error) {
    console.error('Error in deleteActivityLog:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
};

const exportActivityLogs = async (c) => {
  try {
    const { search = '', role = '', activityType = '', dateFrom = '', dateTo = '' } = c.req.query();
    
    let query = supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply same filters as getActivityLogs
    if (search) {
      query = query.or(`user_name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    
    if (role) {
      query = query.eq('user_role', role);
    }
    
    if (activityType) {
      query = query.eq('activity_type', activityType);
    }
    
    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }
    
    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error exporting activity logs:', error);
      return c.json({ success: false, message: error.message }, 500);
    }

    // Convert to CSV format
    const csvHeaders = 'Timestamp,User,Role,Activity Type,Description\n';
    const csvRows = data.map(log => {
      const timestamp = new Date(log.created_at).toLocaleString();
      const escapedDescription = `"${log.description.replace(/"/g, '""')}"`;
      return `${timestamp},${log.user_name},${log.user_role},${log.activity_type},${escapedDescription}`;
    }).join('\n');

    const csvContent = csvHeaders + csvRows;

    return c.text(csvContent, 200, {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="activity_logs_${new Date().toISOString().split('T')[0]}.csv"`
    });
  } catch (error) {
    console.error('Error in exportActivityLogs:', error);
    return c.json({ success: false, message: 'Internal server error' }, 500);
  }
};

module.exports = {
  getActivityLogs,
  createActivityLog,
  deleteActivityLog,
  exportActivityLogs
};