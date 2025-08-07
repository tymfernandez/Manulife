const supabase = require('../supabase');

// Get all accounts
const getAccounts = async (c) => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Create new account
const createAccount = async (c) => {
  try {
    const accountData = await c.req.json();
    const { data, error } = await supabase
      .from('accounts')
      .insert([{
        ...accountData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Update account
const updateAccount = async (c) => {
  try {
    const id = c.req.param('id');
    const accountData = await c.req.json();
    
    const { data, error } = await supabase
      .from('accounts')
      .update(accountData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

// Delete account
const deleteAccount = async (c) => {
  try {
    const id = c.req.param('id');
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

module.exports = { getAccounts, createAccount, updateAccount, deleteAccount };