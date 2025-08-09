// This file is deprecated - all functionality moved to index.js
// Keeping minimal exports for compatibility
const express = require('express');
const router = express.Router();

// Simple health check for backward compatibility
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'deprecated', 
    message: 'This file is deprecated. All functionality moved to index.js',
    timestamp: new Date().toISOString() 
  });
});

// All other routes return deprecation notice
router.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'This endpoint is deprecated. All functionality moved to index.js' 
  });
});

module.exports = router;