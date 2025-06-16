import { users, campaigns, submissions, customers, type User, type InsertUser, type Campaign, type InsertCampaign, type Submission, type InsertSubmission, type Customer, type InsertCustomer } from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Campaign methods
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: number): Promise<Campaign | undefined>;
  getCampaignByUrl(uniqueUrl: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: number): Promise<boolean>;
  
  // Customer methods
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomerByPhone(phone: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  createCustomersBulk(customers: InsertCustomer[]): Promise<Customer[]>;
  
  // Submission methods
  getSubmissions(): Promise<(Submission & { campaignName: string })[]>;
  getSubmissionsByCampaign(campaignId: number): Promise<Submission[]>;
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  updateSubmissionStatus(id: number, status: string): Promise<Submission | undefined>;
  deleteSubmission(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private campaigns: Map<number, Campaign>;
  private submissions: Map<number, Submission>;
  private customers: Map<number, Customer>;
  private currentUserId: number;
  private currentCampaignId: number;
  private currentSubmissionId: number;
  private currentCustomerId: number;

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.submissions = new Map();
    this.customers = new Map();
    this.currentUserId = 1;
    this.currentCampaignId = 1;
    this.currentSubmissionId = 1;
    this.currentCustomerId = 1;
    
    // Initialize with sample campaigns
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample campaigns
    const sampleCampaigns: Campaign[] = [
      {
        id: 1,
        name: "Summer Loyalty Rewards",
        description: "Get 20% off your next purchase by sharing a photo with our products!",
        rewardType: "Discount Coupon",
        rewardValue: "20% Off Coupon",
        endDate: "2024-08-31",
        status: "active",
        uniqueUrl: "summer-2024",
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "Back to School Special",
        description: "Students get exclusive discounts on school supplies and more!",
        rewardType: "Discount Coupon",
        rewardValue: "15% Student Discount",
        endDate: "2024-09-01",
        status: "draft",
        uniqueUrl: "back-to-school-2024",
        createdAt: new Date(),
      },
      {
        id: 3,
        name: "Spring Photo Contest",
        description: "Share your spring moments with our products for a chance to win!",
        rewardType: "Gift Card",
        rewardValue: "$100 Gift Card",
        endDate: "2024-05-31",
        status: "ended",
        uniqueUrl: "spring-contest-2024",
        createdAt: new Date(),
      },
    ];

    sampleCampaigns.forEach(campaign => {
      this.campaigns.set(campaign.id, campaign);
    });
    this.currentCampaignId = 4;

    // Create sample submissions
    const sampleSubmissions: Submission[] = [
      {
        id: 1,
        campaignId: 1,
        customerName: "Sarah Johnson",
        phone: "+1 (555) 123-4567",
        imageUrl: "/uploads/submission-1.jpg",
        status: "approved",
        createdAt: new Date("2024-08-15T14:30:00"),
      },
      {
        id: 2,
        campaignId: 1,
        customerName: "Mike Rodriguez",
        phone: "+1 (555) 987-6543",
        imageUrl: "/uploads/submission-2.jpg",
        status: "pending",
        createdAt: new Date("2024-08-14T16:45:00"),
      },
      {
        id: 3,
        campaignId: 3,
        customerName: "Emily Watson",
        phone: "+1 (555) 456-7890",
        imageUrl: "/uploads/submission-3.jpg",
        status: "approved",
        createdAt: new Date("2024-05-28T11:20:00"),
      },
    ];

    sampleSubmissions.forEach(submission => {
      this.submissions.set(submission.id, submission);
    });
    this.currentSubmissionId = 4;

    // Create sample customers
    const sampleCustomers: Customer[] = [
      {
        id: 1,
        name: "John Smith",
        phone: "+1 (555) 111-2222",
        email: "john.smith@email.com",
        createdAt: new Date("2024-08-01T10:00:00"),
      },
      {
        id: 2,
        name: "Emma Johnson",
        phone: "+1 (555) 333-4444",
        email: "emma.johnson@email.com",
        createdAt: new Date("2024-08-02T11:30:00"),
      },
      {
        id: 3,
        name: "Michael Brown",
        phone: "+1 (555) 555-6666",
        email: "michael.brown@email.com",
        createdAt: new Date("2024-08-03T14:15:00"),
      },
    ];

    sampleCustomers.forEach(customer => {
      this.customers.set(customer.id, customer);
    });
    this.currentCustomerId = 4;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getCampaign(id: number): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async getCampaignByUrl(uniqueUrl: string): Promise<Campaign | undefined> {
    return Array.from(this.campaigns.values()).find(
      (campaign) => campaign.uniqueUrl === uniqueUrl
    );
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = this.currentCampaignId++;
    const uniqueUrl = `${insertCampaign.name.toLowerCase().replace(/\s+/g, '-')}-${nanoid(8)}`;
    const campaign: Campaign = {
      ...insertCampaign,
      id,
      uniqueUrl,
      status: insertCampaign.status || "draft",
      createdAt: new Date(),
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: number, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const campaign = this.campaigns.get(id);
    if (!campaign) return undefined;
    
    const updatedCampaign = { ...campaign, ...updates };
    this.campaigns.set(id, updatedCampaign);
    return updatedCampaign;
  }

  async deleteCampaign(id: number): Promise<boolean> {
    return this.campaigns.delete(id);
  }

  async getSubmissions(): Promise<(Submission & { campaignName: string })[]> {
    const submissions = Array.from(this.submissions.values());
    return submissions.map(submission => {
      const campaign = this.campaigns.get(submission.campaignId);
      return {
        ...submission,
        campaignName: campaign?.name || "Unknown Campaign"
      };
    }).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getSubmissionsByCampaign(campaignId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values())
      .filter(submission => submission.campaignId === campaignId)
      .sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
  }

  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = this.currentSubmissionId++;
    const submission: Submission = {
      ...insertSubmission,
      id,
      status: insertSubmission.status || "pending",
      createdAt: new Date(),
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async updateSubmissionStatus(id: number, status: string): Promise<Submission | undefined> {
    const submission = this.submissions.get(id);
    if (!submission) return undefined;
    
    const updatedSubmission = { ...submission, status };
    this.submissions.set(id, updatedSubmission);
    return updatedSubmission;
  }

  async deleteSubmission(id: number): Promise<boolean> {
    return this.submissions.delete(id);
  }

  // Customer methods
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomerByPhone(phone: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(
      (customer) => customer.phone === phone
    );
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.currentCustomerId++;
    const customer: Customer = {
      ...insertCustomer,
      id,
      createdAt: new Date(),
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    
    const updatedCustomer = { ...customer, ...updates };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }

  async createCustomersBulk(customers: InsertCustomer[]): Promise<Customer[]> {
    const createdCustomers: Customer[] = [];
    
    for (const insertCustomer of customers) {
      // Check if customer with this phone already exists
      const existingCustomer = await this.getCustomerByPhone(insertCustomer.phone);
      if (existingCustomer) {
        // Update existing customer
        const updated = await this.updateCustomer(existingCustomer.id, insertCustomer);
        if (updated) createdCustomers.push(updated);
      } else {
        // Create new customer
        const newCustomer = await this.createCustomer(insertCustomer);
        createdCustomers.push(newCustomer);
      }
    }
    
    return createdCustomers;
  }
}

export const storage = new MemStorage();
