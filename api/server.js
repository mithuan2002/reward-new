const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Create express router instead of app
const router = express.Router();

// Database connection for Vercel
let db;
if (process.env.DATABASE_URL) {
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
} else {
  console.warn('No DATABASE_URL provided, using in-memory storage');
}

// Sample data for demo
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
const users = []; // In-memory users storage for demo

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test DB endpoint
router.get('/api/test-db', (req, res) => {
  res.status(200).json({
    status: 'Database connection working',
    storageType: db ? 'PostgreSQL' : 'MemStorage',
    campaignCount: campaigns.length
  });
});

// Authentication routes with proper database support
router.post('/api/auth/signup', async (req, res) => {
  try {
    console.log('Signup request received:', { body: req.body });

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
    // Check if user already exists
    let existingUser;
    if (db) {
      const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
      existingUser = result.rows[0];
    } else {
      existingUser = users.find(user => user.username === username);
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
    if (db) {
      const result = await db.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, hashedPassword]
      );
      user = result.rows[0];
    } else {
      user = {
        id: users.length + 1,
        username,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.push(user);
    }

    console.log('User created successfully:', user.id);
    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.status(201).json({
      message: 'Account created successfully',
      user: userResponse,
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

router.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    let user;
    if (db) {
      const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
      user = result.rows[0];
    } else {
      user = users.find(user => user.username === username);
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      message: 'Login successful',
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

router.post('/api/auth/logout', async (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Campaign routes
router.get('/api/campaigns', (req, res) => {
  res.json(campaigns);
});

router.get('/api/campaigns/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const campaign = campaigns.find(c => c.id === id);
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  res.json(campaign);
});

router.get('/api/campaigns/url/:uniqueUrl', (req, res) => {
  const { uniqueUrl } = req.params;
  const campaign = campaigns.find(c => c.uniqueUrl === uniqueUrl);
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  res.json(campaign);
});

router.post('/api/campaigns', (req, res) => {
  const newCampaign = {
    id: campaigns.length + 1,
    ...req.body,
    submissionCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  campaigns.push(newCampaign);
  res.status(201).json(newCampaign);
});

router.patch('/api/campaigns/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const campaignIndex = campaigns.findIndex(c => c.id === id);
  if (campaignIndex === -1) {
    return res.status(404).json({ message: 'Campaign not found' });
  }

  campaigns[campaignIndex] = {
    ...campaigns[campaignIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json(campaigns[campaignIndex]);
});

router.delete('/api/campaigns/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const campaignIndex = campaigns.findIndex(c => c.id === id);
  if (campaignIndex === -1) {
    return res.status(404).json({ message: 'Campaign not found' });
  }

  campaigns.splice(campaignIndex, 1);
  res.status(204).send();
});

// Submission routes
router.get('/api/submissions', (req, res) => {
  const { campaignId } = req.query;
  let filteredSubmissions = submissions;

  if (campaignId) {
    filteredSubmissions = submissions.filter(sub => sub.campaignId === parseInt(campaignId));
    // Add campaign name
    filteredSubmissions = filteredSubmissions.map(sub => {
      const campaign = campaigns.find(c => c.id === sub.campaignId);
      return {
        ...sub,
        campaignName: campaign?.name || 'Unknown Campaign'
      };
    });
  }

  res.json(filteredSubmissions);
});

router.post('/api/submissions', (req, res) => {
  const newSubmission = {
    id: submissions.length + 1,
    ...req.body,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  submissions.push(newSubmission);
  res.status(201).json(newSubmission);
});

router.patch('/api/submissions/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Valid status is required' });
  }

  const submissionIndex = submissions.findIndex(s => s.id === id);
  if (submissionIndex === -1) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  submissions[submissionIndex] = {
    ...submissions[submissionIndex],
    status,
    updatedAt: new Date().toISOString()
  };

  res.json(submissions[submissionIndex]);
});

router.delete('/api/submissions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const submissionIndex = submissions.findIndex(s => s.id === id);
  if (submissionIndex === -1) {
    return res.status(404).json({ message: 'Submission not found' });
  }

  submissions.splice(submissionIndex, 1);
  res.status(204).send();
});

// Customer routes
router.get('/api/customers', (req, res) => {
  res.json(customers);
});

router.post('/api/customers', (req, res) => {
  // Check if customer with this phone already exists
  const existingCustomer = customers.find(c => c.phone === req.body.phone);
  if (existingCustomer) {
    return res.status(409).json({ message: 'Customer with this phone number already exists' });
  }

  const newCustomer = {
    id: customers.length + 1,
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

router.post('/api/customers/bulk', (req, res) => {
  const { customers: newCustomers } = req.body;

  if (!Array.isArray(newCustomers) || newCustomers.length === 0) {
    return res.status(400).json({ message: 'Customers array is required' });
  }

  const createdCustomers = [];
  newCustomers.forEach(customerData => {
    const existingCustomer = customers.find(c => c.phone === customerData.phone);
    if (!existingCustomer) {
      const newCustomer = {
        id: customers.length + 1,
        ...customerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      customers.push(newCustomer);
      createdCustomers.push(newCustomer);
    }
  });

  res.status(201).json({
    message: `Successfully processed ${createdCustomers.length} customers`,
    customers: createdCustomers
  });
});

router.put('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const customerIndex = customers.findIndex(c => c.id === id);
  if (customerIndex === -1) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  customers[customerIndex] = {
    ...customers[customerIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json(customers[customerIndex]);
});

router.delete('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const customerIndex = customers.findIndex(c => c.id === id);
  if (customerIndex === -1) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  customers.splice(customerIndex, 1);
  res.status(204).send();
});

// Dashboard stats
router.get('/api/dashboard/stats', (req, res) => {
  const stats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalSubmissions: submissions.length,
    totalCustomers: customers.length,
  };

  res.json(stats);
});

// Widget generation
router.get('/api/campaigns/:id/widget', (req, res) => {
  const campaignId = parseInt(req.params.id);
  const campaign = campaigns.find(c => c.id === campaignId);

  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found' });
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const campaignUrl = `${baseUrl}/c/${campaign.uniqueUrl}`;

  const widgetCode = `<!-- Nambi Campaign Widget -->
<div id="loyaltyboost-widget-${campaign.id}" style="
  border: 2px solid #3b82f6;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
">
  <div style="text-align: center;">
    <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 1.2em; font-weight: bold;">
      🎉 ${campaign.name}
    </h3>
    <p style="margin: 0 0 15px 0; color: #374151; font-size: 0.9em; line-height: 1.4;">
      ${campaign.description}
    </p>
    <div style="
      background: #fef3c7;
      border: 1px solid #f59e0b;
      border-radius: 8px;
      padding: 10px;
      margin: 15px 0;
    ">
      <strong style="color: #92400e; font-size: 1.1em;">
        🎁 Reward: ${campaign.rewardValue}
      </strong>
    </div>
    <a href="${campaignUrl}" target="_blank" style="
      display: inline-block;
      background: #3b82f6;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      font-size: 0.9em;
      transition: background-color 0.2s;
    " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
      📸 Participate Now
    </a>
    <p style="margin: 15px 0 0 0; color: #6b7280; font-size: 0.8em;">
      ⏰ Valid until: ${new Date(campaign.endDate).toLocaleDateString()}
    </p>
  </div>
</div>`;

  res.json({
    campaign: {
      id: campaign.id,
      name: campaign.name,
      description: campaign.description,
      rewardValue: campaign.rewardValue,
      endDate: campaign.endDate,
      url: campaignUrl
    },
    widgetCode,
    instructions: {
      title: 'How to Add This Widget to Your Website',
      steps: [
        'Copy the widget code below',
        'Paste it into your website\'s HTML where you want the campaign to appear',
        'The widget will automatically display your campaign details and link to the submission form',
        'Customers can click \'Participate Now\' to submit their photos and contact information'
      ]
    }
  });
});

// Fallback to serve index.html for SPA routes
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});

module.exports = router;