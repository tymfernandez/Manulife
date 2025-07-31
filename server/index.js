const { Hono } = require('hono');
const { serve } = require('@hono/node-server');

const app = new Hono();

app.get('/api', (c) => {
  return c.json({ message: 'RES Server is running!' });
});

const port = process.env.PORT || 5000;
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on port ${port}`);
});