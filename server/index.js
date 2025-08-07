require('dotenv').config();
const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const { cors } = require('hono/cors');
const supabase = require('./supabase');
const { submitApplication } = require('./routes/Applications');
const { signUp, signIn, signOut } = require('./routes/auth');
const { getSession } = require('./routes/session');
const { getAccounts, createAccount, updateAccount, deleteAccount } = require('./routes/accounts');
const { getRecruits, updateRecruit, deleteRecruit } = require('./routes/recruitment');

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

const port = process.env.PORT || 3000;
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on port ${port}`);
});