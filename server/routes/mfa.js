const { Hono } = require('hono');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { supabase } = require('../supabase');

const app = new Hono();

// Generate MFA secret and QR code
app.post('/enroll', async (c) => {
  try {
    // Get current user from Authorization header
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

    // Generate secret for TOTP
    const secret = speakeasy.generateSecret({
      name: 'Manulife App',
      issuer: 'Manulife'
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Store secret in user metadata
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        mfa_secret: secret.base32,
        mfa_enabled: false // Will be enabled after verification
      }
    });

    if (updateError) {
      console.error('User update error:', updateError);
      return c.json({ success: false, message: 'Failed to store MFA data' }, 500);
    }
    
    return c.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrCodeUrl
      }
    });
  } catch (error) {
    console.error('MFA enroll error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Verify TOTP code
app.post('/verify', async (c) => {
  try {
    const { supabase } = require('../supabase');
    const { secret, code } = await c.req.json();

    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return c.json({ success: false, message: 'Not authenticated' }, 401);
    }

    // Verify the TOTP code
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: code,
      window: 2 // Allow 2 time steps before/after
    });

    if (!verified) {
      return c.json({ success: false, message: 'Invalid code' }, 400);
    }

    // Enable MFA in user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...session.user.user_metadata,
        mfa_enabled: true
      }
    });

    if (updateError) {
      console.error('User update error:', updateError);
      return c.json({ success: false, message: 'Failed to enable MFA' }, 500);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error('MFA verify error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Check MFA status
app.get('/status', async (c) => {
  try {
    const { supabase } = require('../supabase');
    
    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return c.json({ success: false, message: 'Not authenticated' }, 401);
    }

    // Check MFA status from user metadata
    return c.json({ 
      success: true, 
      enabled: session.user.user_metadata?.mfa_enabled || false 
    });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Disable MFA
app.delete('/disable', async (c) => {
  try {
    const { supabase } = require('../supabase');
    
    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !session?.user) {
      return c.json({ success: false, message: 'Not authenticated' }, 401);
    }

    // Disable MFA and remove secret from user metadata
    const { mfa_secret, mfa_enabled, ...otherMetadata } = session.user.user_metadata || {};
    
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...otherMetadata,
        mfa_enabled: false,
        mfa_secret: null
      }
    });

    if (updateError) {
      console.error('User update error:', updateError);
      return c.json({ success: false, message: 'Failed to disable MFA' }, 500);
    }

    return c.json({ success: true });
  } catch (error) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// Verify MFA during login
app.post('/verify-login', async (c) => {
  try {
    const { supabaseAdmin } = require('../supabase');
    const { userId, code } = await c.req.json();

    if (!supabaseAdmin) {
      return c.json({ success: false, message: 'Admin operations not available' }, 500);
    }

    // Get user data
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (userError || !userData.user) {
      return c.json({ success: false, message: 'User not found' }, 404);
    }

    const user = userData.user;
    const mfaSecret = user.user_metadata?.mfa_secret;

    if (!mfaSecret) {
      return c.json({ success: false, message: 'MFA not configured' }, 400);
    }

    // Verify the TOTP code
    const verified = speakeasy.totp.verify({
      secret: mfaSecret,
      encoding: 'base32',
      token: code,
      window: 2
    });

    if (!verified) {
      return c.json({ success: false, message: 'Invalid MFA code' }, 400);
    }

    // Create a session for the user after MFA verification
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email
    });

    if (sessionError) {
      return c.json({ success: false, message: 'Failed to create session' }, 500);
    }

    // MFA verified - return user data for successful login
    return c.json({ 
      success: true, 
      data: { user } 
    });
  } catch (error) {
    console.error('MFA login verify error:', error);
    return c.json({ success: false, message: error.message }, 500);
  }
});

module.exports = app;