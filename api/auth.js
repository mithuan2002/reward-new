// Simplified Vercel authentication endpoint
const bcrypt = require('bcrypt');

// Database connection with better error handling
let sql;

async function initDb() {
  if (!sql) {
    const postgres = require('postgres');
    sql = postgres(process.env.DATABASE_URL, {
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 1,
      idle_timeout: 20,
      max_lifetime: 60 * 30,
    });
  }
  return sql;
}

// Main handler function
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, query, body } = req;
  const action = query.action;

  try {
    if (method === 'POST' && action === 'signup') {
      console.log('Signup request:', body);
      
      const { username, email, password } = body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }

      // Check if user exists
      const db = await initDb();
      const existingUser = await db`SELECT id FROM users WHERE username = ${username}`;
      
      if (existingUser.length > 0) {
        return res.status(409).json({ message: 'Username already exists' });
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await db`
        INSERT INTO users (username, email, password) 
        VALUES (${username}, ${email}, ${hashedPassword}) 
        RETURNING id, username, email
      `;

      const user = result[0];
      
      return res.status(201).json({
        message: 'Account created successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    }

    if (method === 'POST' && action === 'login') {
      console.log('Login request:', { username: body.username });
      
      const { username, password } = body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // Find user
      const db = await initDb();
      const result = await db`SELECT * FROM users WHERE username = ${username}`;
      const user = result[0];
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      return res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      });
    }

    return res.status(404).json({ message: 'Not found' });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}