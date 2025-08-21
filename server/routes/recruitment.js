const { supabase } = require('../supabase');

const getRecruits = async (c) => {
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