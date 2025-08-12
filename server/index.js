require('dotenv').config({ path: '../.env' });
const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const { cors } = require('hono/cors');
const { supabase } = require('./supabase');
const { submitApplication } = require('./routes/Applications');
const { signUp, signIn, signOut } = require('./routes/auth');
const { getSession } = require('./routes/session');
const { getAccounts, createAccount, updateAccount, deleteAccount } = require('./routes/accounts');
const { getRecruits, updateRecruit, deleteRecruit } = require('./routes/recruitment');
// const { migrateUsersToAccounts } = require('./routes/migration');

const app = new Hono();

// Enable CORS for client requests
app.use('/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: false
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
app.get('/api/auth/session', getSession);

// Account management routes
app.get('/api/accounts', getAccounts);
app.post('/api/accounts', createAccount);
app.put('/api/accounts/:id', updateAccount);
app.delete('/api/accounts/:id', deleteAccount);

// Recruitment routes
app.get('/api/recruitment', getRecruits);
app.put('/api/recruitment/:id', updateRecruit);
app.delete('/api/recruitment/:id', deleteRecruit);

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
    
    console.log('Testing service role key...');
    console.log('Service key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    
    // Check authenticated users
    const { data: authData, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    console.log('Auth response:', { authData, usersError });
    
    return c.json({ 
      success: true, 
      serviceKeyExists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
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