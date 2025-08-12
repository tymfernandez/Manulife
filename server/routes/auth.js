const { supabase } = require("../supabase");

const signUp = async (c) => {
  try {
    const { email, password, fullName, contactNumber } = await c.req.json();

    const { data, error } = await supabase.auth.signUp({ email, password });

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
      // Create profile record
      if (fullName || contactNumber) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: fullName || null,
          contact_number: contactNumber || null,
          email: email,
        });
      }
      

    }

    return c.json({ success: true, data });
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
      let message = "Sign in failed";
      let status = 400;

      if (error.message.includes("Invalid login credentials")) {
        message = "Invalid email or password";
        status = 401;
      } else if (error.message.includes("Email not confirmed")) {
        message =
          "Please check your email and confirm your account before signing in";
        status = 403;
      } else if (error.message.includes("Too many requests")) {
        message = "Too many login attempts. Please try again later";
        status = 429;
      } else if (error.message.includes("Invalid email")) {
        message = "Please enter a valid email address";
      } else {
        message = error.message;
      }

      return c.json({ success: false, message }, status);
    }

    return c.json({ success: true, data });
  } catch (error) {
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

module.exports = { signUp, signIn, signOut };
