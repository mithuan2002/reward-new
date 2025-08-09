// Vercel serverless function entry point
const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Database connection using postgres directly
let postgres;
let sql;

// Initialize database connection
async function initDb() {
  if (!postgres) {
    postgres = require('postgres');
    sql = postgres(process.env.DATABASE_URL, {
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 1,
      idle_timeout: 20,
      max_lifetime: 60 * 30,
    });
  }
  return sql;
}

// Sample data for fallback when database is not available
const campaigns = [
  {
    id: 1,
    name: "Summer Loyalty Rewards",
    description: "Get 20% off your next purchase by sharing a photo with our products!",
    rewardType: "Discount Coupon",
    rewardValue: "20% Off Coupon",
    endDate: "2024-08-31",
    status: "active",
    uniqueUrl: "summer-2024",
    submissionCount: 2
  }
];

const submissions = [];
const customers = [];

// Configure multer for Vercel with memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const app = express();

// Basic middleware for Vercel
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS middleware for Vercel
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test DB endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    const db = await initDb();
    const result = await db`SELECT NOW() as current_time`;
    res.status(200).json({
      status: 'Database connection working',
      storageType: 'PostgreSQL',
      campaignCount: campaigns.length,
      dbTime: result[0].current_time
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(200).json({
      status: 'Fallback mode - using memory storage',
      storageType: 'MemStorage',
      campaignCount: campaigns.length,
      error: error.message
    });
  }
});

// Enhanced Authentication routes with proper error handling
app.post('/api/auth/signup', async (req, res) => {
  try {
    console.log('Vercel Signup request received:', { body: req.body });

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log('Missing required fields:', { username: !!username, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    if (password.length < 6) {
      console.log('Password too short:', password.length);
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    console.log('Checking if user exists...');
    // Check if user already exists using postgres client
    let existingUser;
    try {
      const db = await initDb();
      const result = await db`SELECT id FROM users WHERE username = ${username}`;
      existingUser = result[0];
    } catch (dbError) {
      console.error('Database connection error, using fallback:', dbError);
      // Fallback for when database is not available
      existingUser = null;
    }
    
    if (existingUser) {
      console.log('User already exists:', username);
      return res.status(409).json({ message: 'Username already exists' });
    }

    console.log('Hashing password...');
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    let user;
    try {
      const db = await initDb();
      const result = await db`
        INSERT INTO users (username, email, password) 
        VALUES (${username}, ${email}, ${hashedPassword}) 
        RETURNING id, username, email, created_at, updated_at
      `;
      user = result[0];
    } catch (dbError) {
      console.error('Database insert error:', dbError);
      return res.status(500).json({ message: 'Failed to create account - database error' });
    }

    console.log('User created successfully:', user.id);

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
      res.status(400).json({ message: error.message });
    } else {
      console.error('Unknown error:', error);
      res.status(500).json({ message: 'Failed to create account' });
    }
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Vercel Login request received:', { username: req.body.username });
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    let user;
    try {
      const db = await initDb();
      const result = await db`SELECT * FROM users WHERE username = ${username}`;
      user = result[0];
    } catch (dbError) {
      console.error('Database query error:', dbError);
      return res.status(500).json({ message: 'Database connection error' });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    console.log('Login successful for user:', user.id);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Add all other routes from the original server.js
// Campaign routes
app.get('/api/campaigns', async (req, res) => {
  try {
    const db = await initDb();
    const result = await db`SELECT * FROM campaigns ORDER BY created_at DESC`;
    res.json(result);
  } catch (error) {
    console.error('Database error, using fallback:', error);
    res.json(campaigns);
  }
});

app.get('/api/campaigns/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const db = await initDb();
    const result = await db`SELECT * FROM campaigns WHERE id = ${id}`;
    const campaign = result[0];
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    console.error('Database error, using fallback:', error);
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  }
});

app.get('/api/campaigns/url/:uniqueUrl', async (req, res) => {
  const { uniqueUrl } = req.params;
  try {
    const db = await initDb();
    const result = await db`SELECT * FROM campaigns WHERE unique_url = ${uniqueUrl}`;
    const campaign = result[0];
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    console.error('Database error, using fallback:', error);
    const campaign = campaigns.find(c => c.uniqueUrl === uniqueUrl);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  }
});

// Dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const db = await initDb();
    const campaignStats = await db`SELECT 
      COUNT(*) as total_campaigns,
      COUNT(*) FILTER (WHERE status = 'active') as active_campaigns
      FROM campaigns`;
    const submissionStats = await db`SELECT COUNT(*) as total_submissions FROM submissions`;
    const customerStats = await db`SELECT COUNT(*) as total_customers FROM customers`;
    
    const stats = {
      totalCampaigns: parseInt(campaignStats[0].total_campaigns),
      activeCampaigns: parseInt(campaignStats[0].active_campaigns),
      totalSubmissions: parseInt(submissionStats[0].total_submissions),
      totalCustomers: parseInt(customerStats[0].total_customers),
    };

    res.json(stats);
  } catch (error) {
    console.error('Database error, using fallback:', error);
    const stats = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      totalSubmissions: submissions.length,
      totalCustomers: customers.length,
    };
    res.json(stats);
  }
});

// Fallback to serve index.html for SPA routes
app.get('*', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Export for Vercel
module.exports = app;