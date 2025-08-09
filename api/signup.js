// Ultra-simple signup endpoint to test FUNCTION_INVOCATION_FAILED
const bcrypt = require('bcrypt');

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
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Test without database first to isolate the issue
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return res.status(201).json({
      message: 'Test signup successful (no database)',
      user: {
        id: 999,
        username,
        email
      },
      note: 'This is a test response without database connection'
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};