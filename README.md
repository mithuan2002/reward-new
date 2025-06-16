
# Customer Engagement Campaign Platform

A full-stack web application for managing customer engagement campaigns with image submissions, SMS notifications, and admin approval workflows.

## 🏗️ Project Architecture

### **Tech Stack**
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **UI Components**: Radix UI + Tailwind CSS
- **File Uploads**: Multer
- **SMS Service**: Twilio
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form + Zod validation

### **Project Structure**
```
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/            # Shadcn/ui components
│   │   │   └── navigation.tsx  # App navigation
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions and API client
│   │   ├── pages/             # Page components
│   │   │   ├── admin-dashboard.tsx  # Admin management interface
│   │   │   ├── customer-form.tsx    # Customer submission form
│   │   │   └── not-found.tsx        # 404 page
│   │   ├── App.tsx            # Root component with routing
│   │   └── main.tsx           # App entry point
│   └── index.html             # HTML template
├── server/                     # Backend Express application
│   ├── db.ts                  # Database connection setup
│   ├── index.ts               # Server entry point
│   ├── routes.ts              # API routes and handlers
│   ├── storage.ts             # Database operations (service layer)
│   └── vite.ts                # Vite development server integration
├── shared/                     # Shared code between client/server
│   └── schema.ts              # Zod schemas for validation
├── uploads/                    # File upload storage directory
└── Configuration files (package.json, tsconfig.json, etc.)
```

## 📋 Feature Overview

### **Admin Dashboard Features**
1. **Campaign Management**
   - Create, edit, delete campaigns
   - Set campaign details (name, description, reward, dates)
   - Generate unique campaign URLs
   - Bulk SMS messaging to customers

2. **Submission Management**
   - View all customer submissions
   - Approve/reject submissions with image preview
   - Real-time status updates

3. **Customer Management**
   - View customer database
   - Add customers individually or in bulk
   - Manage customer contact information

### **Customer Features**
1. **Campaign Participation**
   - Access campaigns via unique URLs
   - Submit photos with personal information
   - Receive campaign details via SMS

## 🔧 Database Schema

### **Tables**
1. **campaigns**
   - `id` (Primary Key)
   - `name` (Campaign name)
   - `description` (Campaign details)
   - `uniqueUrl` (Generated unique identifier)
   - `rewardValue` (Reward description)
   - `startDate` / `endDate` (Campaign duration)
   - `status` (active/inactive)

2. **submissions**
   - `id` (Primary Key)
   - `campaignId` (Foreign Key to campaigns)
   - `customerName` (Submitter name)
   - `phone` (Contact number)
   - `imageUrl` (Uploaded image path)
   - `status` (pending/approved/rejected)
   - `createdAt` (Submission timestamp)

3. **customers**
   - `id` (Primary Key)
   - `name` (Customer name)
   - `phone` (Contact number - unique)
   - `createdAt` (Registration timestamp)

## 🚀 User Flow

### **Admin Workflow**
1. **Campaign Creation**
   ```
   Admin Dashboard → Create Campaign → Set Details → Generate URL → Campaign Active
   ```

2. **Customer Outreach**
   ```
   Select Campaign → Bulk Message → SMS sent to all customers with campaign URL
   ```

3. **Submission Management**
   ```
   View Submissions → Click to View Image → Approve/Reject → Status Updated
   ```

### **Customer Workflow**
1. **Campaign Access**
   ```
   Receive SMS → Click Campaign URL → View Campaign Details
   ```

2. **Submission Process**
   ```
   Fill Form (Name, Phone) → Upload Image → Submit → Awaiting Approval
   ```

## 🛠️ API Endpoints

### **Campaign Routes**
- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/:id` - Get specific campaign
- `GET /api/campaigns/url/:uniqueUrl` - Get campaign by URL
- `POST /api/campaigns` - Create new campaign
- `PATCH /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/campaigns/bulk-message` - Send SMS to customers

### **Submission Routes**
- `GET /api/submissions` - List submissions (with optional campaignId filter)
- `POST /api/submissions` - Create submission (with file upload)
- `PATCH /api/submissions/:id/status` - Update submission status
- `DELETE /api/submissions/:id` - Delete submission

### **Customer Routes**
- `GET /api/customers` - List all customers
- `POST /api/customers` - Add single customer
- `POST /api/customers/bulk` - Add multiple customers
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### **Utility Routes**
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /uploads/:filename` - Serve uploaded images

## 🔐 Environment Configuration

Required environment variables:
```env
# Database
DATABASE_URL=postgresql://username:password@host/database

# Twilio SMS (Optional - simulates if not provided)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

## 🏃‍♂️ Development Setup

### **Installation & Start**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### **Build & Deploy**
```bash
# Build for production
npm run build

# Start production server
npm run start
```

### **Database Operations**
```bash
# Push schema changes
npm run db:push

# Type checking
npm run check
```

## 📱 File Upload Handling

- **Supported formats**: JPEG, JPG, PNG, GIF
- **Size limit**: 10MB
- **Storage**: Local filesystem (`/uploads` directory)
- **Naming**: Unique filename with original extension
- **Security**: File type validation and size limits

## 📧 SMS Integration

### **Twilio Setup**
1. Create Twilio account
2. Get Account SID, Auth Token, and Phone Number
3. Add to environment variables
4. SMS automatically sent when "Bulk Message" is clicked

### **Message Template**
```
🎉 Exciting News from [Campaign Name]!

You're invited to participate in our loyalty campaign and earn rewards!

Campaign Details:
📋 [Description]
🎁 Reward: [Reward Value]
⏰ Valid until: [End Date]

🔗 Participate now: [Campaign URL]

Upload your photo and claim your reward today!
```

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern Components**: Radix UI primitives with custom styling
- **Real-time Updates**: React Query for data synchronization
- **Image Preview**: Modal dialogs for submission image viewing
- **Form Validation**: Zod schemas with React Hook Form
- **Toast Notifications**: User feedback for actions

## 🔄 Development Workflow

1. **Hot Reload**: Vite provides instant frontend updates
2. **Type Safety**: TypeScript across the entire stack
3. **Schema Validation**: Shared Zod schemas between client/server
4. **Error Handling**: Comprehensive error boundaries and API error handling
5. **Code Organization**: Clear separation of concerns with service layers

This platform provides a complete solution for customer engagement campaigns with image submissions, automated SMS notifications, and streamlined admin workflows.
