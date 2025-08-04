require('dotenv').config();
const { Hono } = require('hono');
const { serve } = require('@hono/node-server');
const supabase = require('./supabase');

const app = new Hono();

app.get('/api', (c) => {
  return c.json({ message: 'RES Server is running!', supabase: 'connected' });
});

app.get('/api/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 5173;
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on port ${port}`);
});