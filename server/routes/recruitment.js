const supabase = require('../supabase');

const getRecruits = async (c) => {
  try {
    const { data, error } = await supabase
      .from('recruitment')
      .select('*')
      .order('createdat', { ascending: false });
    
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
      .from('recruitment')
      .update({
        fullname: recruitData.fullName,
        email: recruitData.email,
        priority: recruitData.position,
        status: recruitData.status,
        updatedat: new Date().toISOString()
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    return c.json({ success: true, data: data[0] });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

const deleteRecruit = async (c) => {
  try {
    const id = c.req.param('id');
    
    const { error } = await supabase
      .from('recruitment')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

module.exports = { getRecruits, updateRecruit, deleteRecruit };