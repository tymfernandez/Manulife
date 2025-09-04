const { supabase } = require('../supabase');

const getSession = async (c) => {
  try {
    const cookies = c.req.header('Cookie');
    let accessToken = null;
    
    if (cookies) {
      const tokenMatch = cookies.match(/sb-access-token=([^;]+)/);
      accessToken = tokenMatch ? tokenMatch[1] : null;
    }
    
    if (!accessToken) {
      return c.json({ success: true, session: null });
    }

    const { supabaseAdmin } = require('../supabase');
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ success: true, session: null });
    }

    return c.json({ 
      success: true, 
      session: {
        user: user,
        access_token: accessToken
      }
    });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 400);
  }
};

module.exports = { getSession };