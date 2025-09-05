const { supabase } = require('../supabase');

const getSession = async (c) => {
  try {
    const cookies = c.req.header('Cookie') || '';
    const accessToken = cookies.match(/sb-access-token=([^;]+)/)?.[1];
    const userId = cookies.match(/sb-user-id=([^;]+)/)?.[1];
    
    if (!accessToken || !userId) {
      return c.json({ success: true, session: null });
    }

    const { supabaseAdmin } = require('../supabase');
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user || user.id !== userId) {
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