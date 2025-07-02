
import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface BulkEmailData {
  subject: string;
  htmlContent: string;
  recipients: string[];
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.setupTransporter();
  }

  private setupTransporter() {
    // For development, we'll use a test account
    // In production, replace with real SMTP credentials
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'test@example.com',
        pass: process.env.SMTP_PASS || 'test123'
      }
    };

    this.transporter = nodemailer.createTransport(config);
  }

  async sendBulkEmail(data: BulkEmailData): Promise<{ sent: number; failed: string[] }> {
    if (!this.transporter) {
      throw new Error('Email transporter not configured');
    }

    const results = { sent: 0, failed: [] as string[] };

    for (const recipient of data.recipients) {
      try {
        await this.transporter.sendMail({
          from: process.env.FROM_EMAIL || 'noreply@loyaltyboost.com',
          to: recipient,
          subject: data.subject,
          html: data.htmlContent
        });
        results.sent++;
      } catch (error) {
        results.failed.push(recipient);
        console.error(`Failed to send email to ${recipient}:`, error);
      }
    }

    return results;
  }

  async testConnection(): Promise<boolean> {
    if (!this.transporter) return false;
    
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email connection test failed:', error);
      return false;
    }
  }

  generateCampaignEmailTemplate(campaign: any, baseUrl: string): string {
    const campaignUrl = `${baseUrl}/c/${campaign.uniqueUrl}`;
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${campaign.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px; }
            .header { text-align: center; margin-bottom: 30px; }
            .campaign-title { color: #1e40af; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .campaign-description { color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 20px; }
            .reward-box { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .reward-text { color: #92400e; font-size: 18px; font-weight: bold; }
            .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="campaign-title">🎉 ${campaign.name}</h1>
              <p class="campaign-description">${campaign.description}</p>
            </div>
            
            <div class="reward-box">
              <div class="reward-text">🎁 Reward: ${campaign.rewardValue}</div>
            </div>
            
            <div style="text-align: center;">
              <a href="${campaignUrl}" class="cta-button">📸 Participate Now</a>
            </div>
            
            <div class="footer">
              <p>⏰ Valid until: ${new Date(campaign.endDate).toLocaleDateString()}</p>
              <p>This is an automated email from LoyaltyBoost.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export const emailService = new EmailService();
