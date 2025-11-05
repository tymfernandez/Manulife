const { supabase } = require("../supabase");

const signUp = async (c) => {
  try {
    const { email, password, fullName, contactNumber, personalCode } = await c.req.json();

    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${process.env.CLIENT_URL || 'http://localhost:5173'}/signin`,
        data: {
          full_name: fullName || null,
          contact_number: contactNumber || null,
          personal_code: personalCode || null
        }
      }
    });

    if (error) {
      let message = "Registration failed";
      let status = 400;

      if (error.message.includes("User already registered")) {
        message = "An account with this email already exists";
        status = 409;
      } else if (error.message.includes("Password should be at least")) {
        message = "Password must be at least 6 characters long";
      } else if (error.message.includes("Invalid email")) {
        message = "Please enter a valid email address";
      } else if (error.message.includes("Signup is disabled")) {
        message = "Account registration is currently disabled";
        status = 503;
      } else {
        message = error.message;
      }

      return c.json({ success: false, message }, status);
    }

    if (data.user) {
      // Create profile record if needed
      if (fullName || contactNumber) {
        try {
          await supabase.from("profiles").insert({
            id: data.user.id,
            full_name: fullName || null,
            contact_number: contactNumber || null,
            email: email,
          });
        } catch (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }
    }

    return c.json({ 
      success: true, 
      data,
      message: data.user && !data.session ? "Please check your email to confirm your account" : "Account created successfully"
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "An unexpected error occurred during registration",
      },
      500
    );
  }
};

const signIn = async (c) => {
  try {
    const { email, password } = await c.req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase signin error:', error);
      let message = "Sign in failed";
      let status = 400;

      if (error.message.includes("Invalid login credentials")) {
        message = "Invalid email or password. Make sure you've confirmed your email.";
        status = 401;
      } else if (error.message.includes("Email not confirmed")) {
        message = "Please check your email and confirm your account before signing in";
        status = 403;
      } else if (error.message.includes("Too many requests")) {
        message = "Too many login attempts. Please try again later";
        status = 429;
      } else {
        message = error.message;
      }

      return c.json({ success: false, message }, status);
    }

    if (!data.user) {
      return c.json({ success: false, message: "No user data returned" }, 400);
    }

    // Check if user has MFA enabled
    if (data.user.user_metadata?.mfa_enabled) {
      // Return MFA requirement without signing out
      return c.json({ 
        success: true, 
        requiresMfa: true,
        tempUserId: data.user.id,
        message: "MFA verification required" 
      });
    }

    return c.json({ success: true, data });
  } catch (error) {
    console.error('SignIn error:', error);
    return c.json(
      {
        success: false,
        message: "An unexpected error occurred during sign in",
      },
      500
    );
  }
};

const signOut = async (c) => {
  try {
    // Clear session cookies
    c.header('Set-Cookie', 'sb-access-token=; HttpOnly; SameSite=None; Secure; Path=/; Max-Age=0');
    c.header('Set-Cookie', 'sb-refresh-token=; HttpOnly; SameSite=None; Secure; Path=/; Max-Age=0');
    c.header('Set-Cookie', 'sb-user-id=; HttpOnly; SameSite=None; Secure; Path=/; Max-Age=0');

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 400);
  }
};

const updateProfile = async (c) => {
  try {
    const { first_name, last_name, contact_number, address } = await c.req.json();
    const userId = c.req.header('user-id');
    
    if (!userId) {
      return c.json({ success: false, message: 'User ID required' }, 401);
    }
    
    const { supabaseAdmin } = require('../supabase');
    
    // Update user metadata
    if (supabaseAdmin) {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          first_name,
          last_name,
          contact_number,
          address
        }
      });
    }
    
    // Try to update user_profiles table, but don't fail if it doesn't work
    try {
      await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          number: contact_number,
          address: address
        }, { onConflict: 'id' });
    } catch (profileError) {
      console.error('Profile table update failed (non-critical):', profileError);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 400);
  }
};

const getProfile = async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, message: 'Not authenticated' }, 401);
    }

    const token = authHeader.substring(7);
    const { supabaseAdmin } = require('../supabase');
    
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return c.json({ success: false, message: 'Invalid token' }, 401);
    }
    
    const userId = user.id;
    
    // Get user data
    const { data: userData, error: userDataError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (userDataError || !userData.user) {
      return c.json({ success: false, message: 'User not found' }, 404);
    }

    // Get profile data from user_profiles table
    let profileData = null;
    try {
      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('number, address, role')
        .eq('id', userId)
        .single();
      profileData = data;
    } catch (profileError) {
      // Non-critical error
    }

    return c.json({ 
      success: true, 
      data: {
        first_name: userData.user.user_metadata?.first_name || '',
        last_name: userData.user.user_metadata?.last_name || '',
        contact_number: profileData?.number || userData.user.user_metadata?.contact_number || '',
        address: profileData?.address || userData.user.user_metadata?.address || '',
        email: userData.user.email,
        role: profileData?.role || 'Sys Admin'
      }
    });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

const changePassword = async (c) => {
  try {
    const { currentPassword, newPassword, userId } = await c.req.json();
    
    if (!userId || !currentPassword || !newPassword) {
      return c.json({ success: false, message: 'Current password, new password, and user ID are required' }, 400);
    }
    
    const { supabaseAdmin } = require('../supabase');
    
    if (!supabaseAdmin) {
      return c.json({ success: false, message: 'Admin client not configured' }, 500);
    }
    
    // First, get user's email to verify current password
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError || !userData.user) {
      return c.json({ success: false, message: 'User not found' }, 404);
    }
    
    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userData.user.email,
      password: currentPassword
    });
    
    if (signInError) {
      return c.json({ success: false, message: 'Current password is incorrect' }, 401);
    }
    
    // Update password using Supabase Admin API
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword
    });
    
    if (error) throw error;
    
    return c.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

const resetPassword = async (c) => {
  try {
    const { email } = await c.req.json();
    
    if (!email) {
      return c.json({ success: false, message: 'Email is required' }, 400);
    }
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password`
    });
    
    if (error) {
      console.error('Reset password error:', error);
      throw error;
    }
    
    return c.json({ 
      success: true, 
      message: 'Password reset email sent successfully'
    });
  } catch (error) {
    console.error('Reset password catch error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
};

const updatePassword = async (c) => {
  try {
    const { password } = await c.req.json();
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ success: false, message: 'Not authenticated' }, 401);
    }

    const token = authHeader.substring(7);
    const { supabaseAdmin } = require('../supabase');
    
    if (!password) {
      return c.json({ success: false, message: 'Password is required' }, 400);
    }
    
    // Get user from token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return c.json({ success: false, message: 'Invalid token' }, 401);
    }
    
    // Update password
    const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: password
    });
    
    if (error) {
      throw error;
    }
    
    return c.json({ 
      success: true, 
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
};

module.exports = { signUp, signIn, signOut, updateProfile, getProfile, changePassword, resetPassword, updatePassword };
