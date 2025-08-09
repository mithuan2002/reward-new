const express = require('express');
const path = require('path');

// Create express app
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist/public')));

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

// API Routes
app.get('/api/campaigns', (req, res) => {
  res.json(campaigns);
});

app.post('/api/campaigns', (req, res) => {
  const newCampaign = {
    id: campaigns.length + 1,
    ...req.body,
    submissionCount: 0
  };
  campaigns.push(newCampaign);
  res.json(newCampaign);
});

app.get('/api/submissions', (req, res) => {
  res.json(submissions);
});

app.post('/api/submissions', (req, res) => {
  const newSubmission = {
    id: submissions.length + 1,
    ...req.body,
    status: 'pending'
  };
  submissions.push(newSubmission);
  res.json(newSubmission);
});

app.get('/api/customers', (req, res) => {
  res.json(customers);
});

app.post('/api/customers', (req, res) => {
  const newCustomer = {
    id: customers.length + 1,
    ...req.body
  };
  customers.push(newCustomer);
  res.json(newCustomer);
});

// Fallback to serve index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/public/index.html'));
});

module.exports = app;