const { supabase } = require("../supabase");

const signUp = async (c) => {
  try {
    const { email, password, fullName, contactNumber, personalCode } = await c.req.json();

    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
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
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 400);
  }
};

const updateProfile = async (c) => {
  try {
    const { first_name, last_name, contact_number, address, date_of_birth } = await c.req.json();
    
    const { data, error } = await supabase.auth.updateUser({
      data: {
        first_name,
        last_name,
        contact_number,
        address,
        date_of_birth
      }
    });
    
    if (error) throw error;
    
    return c.json({ success: true, data });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 400);
  }
};

const getProfile = async (c) => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session?.user) {
      return c.json({ success: false, message: 'Not authenticated' }, 401);
    }

    return c.json({ 
      success: true, 
      data: {
        first_name: session.user.user_metadata?.first_name || '',
        last_name: session.user.user_metadata?.last_name || '',
        email: session.user.email
      }
    });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
};

module.exports = { signUp, signIn, signOut, updateProfile, getProfile };
