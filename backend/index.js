// Entry point for the Express backend
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Coffee Finder backend is running');
});

// Placeholder for coffee shop search endpoint
app.get('/api/coffee-shops', (req, res) => {
  // TODO: Integrate with Google Places API
  res.json({ message: 'Search endpoint not implemented yet.' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
