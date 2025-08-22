// Load environment variables from both project root and server folder (fallback)
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });
const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const { cors } = require('hono/cors');
const { supabase } = require('./supabase');
const { submitApplication } = require('./routes/Applications');
const { signUp, signIn, signOut, updateProfile, getProfile } = require('./routes/auth');
const { getSession } = require('./routes/session');
const { getAccounts, createAccount, updateAccount, deleteAccount } = require('./routes/accounts');
const { getRecruits, updateRecruit, deleteRecruit, getRecruitsWithDetails, getApplicationsWithRecruitment } = require('./routes/recruitment');
const { getActivityLogs, createActivityLog, deleteActivityLog, exportActivityLogs } = require('./routes/activityLogs');
const { getUserSettings, updateUserSettings, changePassword, exportUserData, submitSupportTicket, getUserTickets } = require('./routes/settings');
const mfaRoutes = require('./routes/mfa');
const { getUserRole } = require('./routes/roles');
// const { migrateUsersToAccounts } = require('./routes/migration');


const app = new Hono();

// Enable CORS for client requests
app.use('/*', cors({
  origin: 'http://localhost:5174',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'user-id'],
  credentials: true
}));

// Handle preflight requests
app.options('/*', (c) => {
  return c.text('', 200);
});

app.get('/api', (c) => {
  return c.json({ message: 'RES Server is running!', supabase: 'connected' });
});

app.get('/api/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post('/api/Applications', submitApplication);
app.post('/api/auth/signup', signUp);
app.post('/api/auth/signin', signIn);
app.post('/api/auth/signout', signOut);
app.post('/api/auth/update-profile', updateProfile);
app.get('/api/auth/profile', getProfile);
app.get('/api/auth/session', getSession);

// Account management routes
app.get('/api/accounts', getAccounts);
app.post('/api/accounts', createAccount);
app.put('/api/accounts/:id', updateAccount);
app.delete('/api/accounts/:id', deleteAccount);

// Recruitment routes
app.get('/api/recruitment', getRecruits);
app.get('/api/recruitment/details', getRecruitsWithDetails);
app.get('/api/applications/recruitment', getApplicationsWithRecruitment);
app.put('/api/recruitment/:id', updateRecruit);
app.delete('/api/recruitment/:id', deleteRecruit);

// Activity logs routes
app.get('/api/activity-logs', getActivityLogs);
app.post('/api/activity-logs', createActivityLog);
app.delete('/api/activity-logs/:id', deleteActivityLog);
app.get('/api/activity-logs/export', exportActivityLogs);

// Settings routes
app.get('/api/settings', getUserSettings);
app.put('/api/settings', updateUserSettings);
app.put('/api/settings/password', changePassword);
app.post('/api/settings/export', exportUserData);
app.post('/api/settings/support', submitSupportTicket);
app.get('/api/settings/tickets', getUserTickets);

// MFA routes
app.route('/api/mfa', mfaRoutes);

// Role routes
app.get('/api/user/role', getUserRole);

// Migration route
// app.post('/api/migrate-users', migrateUsersToAccounts);

// Test routes
app.get('/api/test-migrate', (c) => {
  return c.json({ success: true, message: 'GET Test route working' });
});
app.post('/api/test-migrate', (c) => {
  return c.json({ success: true, message: 'POST Test route working' });
});

// Debug route to check authenticated users
app.get('/api/debug', async (c) => {
  try {
    const { supabaseAdmin } = require('./supabase');

    const serviceKeyExists = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    console.log('Testing service role key...');
    console.log('Service key exists:', serviceKeyExists);

    if (!serviceKeyExists || !supabaseAdmin) {
      return c.json({
        success: false,
        serviceKeyExists,
        message: 'Service role key not configured. Admin-only operations are disabled.'
      }, 400);
    }

    // Check authenticated users (requires service role key)
    const { data: authData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();

    console.log('Auth response:', { authData, usersError });

    return c.json({
      success: true,
      serviceKeyExists,
      users: authData?.users?.length || 0,
      usersError: usersError?.message || null,
      firstUser: authData?.users?.[0]?.email || null
    });
  } catch (error) {
    console.error('Debug error:', error);
    return c.json({ success: false, error: error.message });
  }
});

const port = process.env.PORT || 3000;
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on port ${port}`);
});