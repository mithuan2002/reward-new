import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailService } from "./email";
import { insertCampaignSchema, insertSubmissionSchema, insertCustomerSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const upload = multer({
  dest: uploadsDir,
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

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Serve uploaded files
  app.use("/uploads", (req, res, next) => {
    res.sendFile(path.join(uploadsDir, req.path));
  });

  // Campaign routes
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      const campaignsWithStats = await Promise.all(
        campaigns.map(async (campaign) => {
          const submissions = await storage.getSubmissionsByCampaign(campaign.id);
          return {
            ...campaign,
            submissionCount: submissions.length,
          };
        })
      );
      res.json(campaignsWithStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.getCampaign(id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.get("/api/campaigns/url/:uniqueUrl", async (req, res) => {
    try {
      const { uniqueUrl } = req.params;
      const campaign = await storage.getCampaignByUrl(uniqueUrl);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create campaign" });
      }
    }
  });

  app.patch("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const campaign = await storage.updateCampaign(id, req.body);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCampaign(id);
      if (!deleted) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Submission routes
  app.get("/api/submissions", async (req, res) => {
    try {
      const { campaignId } = req.query;
      let submissions;
      
      if (campaignId) {
        submissions = await storage.getSubmissionsByCampaign(parseInt(campaignId as string));
        // Add campaign name for consistency
        const campaign = await storage.getCampaign(parseInt(campaignId as string));
        submissions = submissions.map(sub => ({
          ...sub,
          campaignName: campaign?.name || "Unknown Campaign"
        }));
      } else {
        submissions = await storage.getSubmissions();
      }
      
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  app.post("/api/submissions", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      const { campaignId, customerName, phone } = req.body;
      
      // Validate required fields
      if (!campaignId || !customerName || !phone) {
        return res.status(400).json({ message: "Campaign ID, customer name, and phone are required" });
      }

      // Verify campaign exists
      const campaign = await storage.getCampaign(parseInt(campaignId));
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // Rename uploaded file with proper extension
      const fileExtension = path.extname(req.file.originalname);
      const newFileName = `${req.file.filename}${fileExtension}`;
      const newFilePath = path.join(uploadsDir, newFileName);
      
      fs.renameSync(req.file.path, newFilePath);

      const submissionData = {
        campaignId: parseInt(campaignId),
        customerName,
        phone,
        imageUrl: `/uploads/${newFileName}`,
      };

      const validatedData = insertSubmissionSchema.parse(submissionData);
      const submission = await storage.createSubmission(validatedData);
      
      res.status(201).json(submission);
    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create submission" });
      }
    }
  });

  app.patch("/api/submissions/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Valid status is required" });
      }

      const submission = await storage.updateSubmissionStatus(id, status);
      if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: "Failed to update submission status" });
    }
  });

  app.delete("/api/submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteSubmission(id);
      if (!deleted) {
        return res.status(404).json({ message: "Submission not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete submission" });
    }
  });

  // Customer routes
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      
      // Check if customer with this phone already exists
      const existingCustomer = await storage.getCustomerByPhone(validatedData.phone);
      if (existingCustomer) {
        return res.status(409).json({ message: "Customer with this phone number already exists" });
      }
      
      const customer = await storage.createCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create customer" });
      }
    }
  });

  app.post("/api/customers/bulk", async (req, res) => {
    try {
      const { customers } = req.body;
      
      if (!Array.isArray(customers) || customers.length === 0) {
        return res.status(400).json({ message: "Customers array is required" });
      }

      // Validate each customer record
      const validatedCustomers = customers.map(customer => insertCustomerSchema.parse(customer));
      
      const createdCustomers = await storage.createCustomersBulk(validatedCustomers);
      res.status(201).json({ 
        message: `Successfully processed ${createdCustomers.length} customers`,
        customers: createdCustomers 
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create customers in bulk" });
      }
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = insertCustomerSchema.partial().parse(req.body);
      
      const customer = await storage.updateCustomer(id, updates);
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.json(customer);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to update customer" });
      }
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCustomer(id);
      if (!deleted) {
        return res.status(404).json({ message: "Customer not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete customer" });
    }
  });

  // Generate campaign widget code
  app.get("/api/campaigns/:id/widget", async (req, res) => {
    try {
      const campaignId = parseInt(req.params.id);
      const campaign = await storage.getCampaign(campaignId);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }



      // Get base URL from request
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const campaignUrl = `${baseUrl}/c/${campaign.uniqueUrl}`;

      // Generate widget code - using correct database field names
      const widgetCode = `<!-- LoyaltyBoost Campaign Widget -->
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
          title: "How to Add This Widget to Your Website",
          steps: [
            "Copy the widget code below",
            "Paste it into your website's HTML where you want the campaign to appear",
            "The widget will automatically display your campaign details and link to the submission form",
            "Customers can click 'Participate Now' to submit their photos and contact information"
          ]
        }
      });
    } catch (error) {
      console.error("Widget generation error:", error);
      res.status(500).json({ message: "Failed to generate widget code" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      const submissions = await storage.getSubmissions();
      const customers = await storage.getCustomers();
      
      const stats = {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.status === "active").length,
        totalSubmissions: submissions.length,
        totalCustomers: customers.length,
        avgEngagement: 73, // This could be calculated based on actual data
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Bulk email routes
  app.post("/api/email/test-connection", async (req, res) => {
    try {
      const isConnected = await emailService.testConnection();
      res.json({ connected: isConnected });
    } catch (error) {
      res.status(500).json({ message: "Failed to test email connection" });
    }
  });

  app.post("/api/email/send-campaign", async (req, res) => {
    try {
      const { campaignId, subject, recipients } = req.body;
      
      if (!campaignId || !subject || !recipients || !Array.isArray(recipients)) {
        return res.status(400).json({ message: "Campaign ID, subject, and recipients are required" });
      }

      // Get campaign details
      const campaign = await storage.getCampaign(parseInt(campaignId));
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }

      // Generate email content
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const htmlContent = emailService.generateCampaignEmailTemplate(campaign, baseUrl);

      // Send bulk email
      const results = await emailService.sendBulkEmail({
        subject,
        htmlContent,
        recipients
      });

      res.json({
        message: `Email sent to ${results.sent} recipients`,
        sent: results.sent,
        failed: results.failed.length,
        failedRecipients: results.failed
      });
    } catch (error) {
      console.error("Bulk email error:", error);
      res.status(500).json({ message: "Failed to send bulk email" });
    }
  });

  app.post("/api/email/send-custom", async (req, res) => {
    try {
      const { subject, htmlContent, recipients } = req.body;
      
      if (!subject || !htmlContent || !recipients || !Array.isArray(recipients)) {
        return res.status(400).json({ message: "Subject, content, and recipients are required" });
      }

      const results = await emailService.sendBulkEmail({
        subject,
        htmlContent,
        recipients
      });

      res.json({
        message: `Email sent to ${results.sent} recipients`,
        sent: results.sent,
        failed: results.failed.length,
        failedRecipients: results.failed
      });
    } catch (error) {
      console.error("Custom bulk email error:", error);
      res.status(500).json({ message: "Failed to send custom bulk email" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
