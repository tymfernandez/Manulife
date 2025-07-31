const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'RES Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});