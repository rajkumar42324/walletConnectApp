const express = require('express');
const path = require('path');

// Create an instance of Express
const app = express();

// Use the port provided by the hosting environment or default to 3000
const PORT = process.env.PORT || 3000;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Route all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on the configured domain or IP address (port: ${PORT})`);
});
