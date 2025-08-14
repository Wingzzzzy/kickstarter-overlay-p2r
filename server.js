// Simple Node.js server for Kickstarter OBS overlay
// Serves static files and proxies Kickstarter API to avoid CORS issues

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/config', express.static(path.join(__dirname, 'config')));

// Proxy endpoint for Kickstarter API
app.get('/api/kickstarter', async (req, res) => {
  try {
    const apiUrl = 'https://www.kickstarter.com/projects/postal2redux/postal-2-redux/stats.json';
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Kickstarter data' });
  }
});

app.listen(PORT, () => {
  console.log(`Overlay server running at http://localhost:${PORT}`);
});
