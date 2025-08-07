require('dotenv').config();
const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const { cors } = require('hono/cors');
const supabase = require('./supabase');
const { submitApplication } = require('./routes/Applications');
const { signUp, signIn, signOut } = require('./routes/auth');
const { getSession } = require('./routes/session');

const app = new Hono();

// Enable CORS for client requests
app.use('/*', cors({
  origin: 'http://localhost:5174',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type'],
}));

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

const port = process.env.PORT || 3000;
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on port ${port}`);
});