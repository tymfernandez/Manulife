const { supabase } = require('../supabase');

const getSession = async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: true, session: null });
    }

    const token = authHeader.substring(7);
    const { supabaseAdmin } = require('../supabase');
    
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return c.json({ success: true, session: null });
    }

    return c.json({ 
      success: true, 
      session: {
        user: user,
        access_token: token
      }
    });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 400);
  }
};

module.exports = { getSession };