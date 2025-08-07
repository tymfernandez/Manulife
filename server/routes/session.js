const supabase = require('../supabase');

const getSession = async (c) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw error;

    return c.json({ 
      success: true, 
      session: session ? {
        user: session.user,
        access_token: session.access_token
      } : null 
    });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 400);
  }
};

module.exports = { getSession };