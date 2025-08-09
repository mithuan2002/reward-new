// Basic authentication without bcrypt to isolate the dependency issue
const crypto = require('crypto');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, email, password, action } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (action === 'signup') {
      if (!email) {
        return res.status(400).json({ message: 'Email is required for signup' });
      }

      // Use crypto instead of bcrypt to avoid native compilation issues
      const hash = crypto.createHash('sha256').update(password).digest('hex');
      
      return res.status(201).json({
        message: 'Test signup successful (basic crypto)',
        user: {
          id: Date.now(),
          username,
          email
        },
        note: 'Using basic crypto instead of bcrypt'
      });
    }

    if (action === 'login') {
      return res.status(200).json({
        message: 'Test login successful',
        user: {
          id: 1,
          username,
          email: 'test@example.com'
        },
        note: 'Mock login response for testing'
      });
    }

    return res.status(400).json({ message: 'Invalid action' });

  } catch (error) {
    console.error('Basic auth error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};