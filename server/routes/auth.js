const supabase = require('../supabase');

const signUp = async (c) => {
  try {
    const { email, password, fullName, contactNumber } = await c.req.json();

    const { data, error } = await supabase.auth.signUp({ email, password });
    
    if (error) throw error;

    if (data.user && (fullName || contactNumber)) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName || null,
        contact_number: contactNumber || null,
        email: email,
      });
    }

    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 400);
  }
};

const signIn = async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
    
    if (error) throw error;

    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 400);
  }
};

const signOut = async (c) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 400);
  }
};

module.exports = { signUp, signIn, signOut };