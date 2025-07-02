# Nambi - Build everlasting relationship with your customers

A comprehensive customer loyalty and engagement platform built with React, TypeScript, and Express. This application helps businesses create photo-based reward campaigns, manage customer submissions, and boost customer engagement through interactive experiences.

## Overview

LoyaltyBoost is a full-stack web application for creating and managing customer loyalty campaigns. The platform allows businesses to create campaigns with photo submission requirements and manage customer submissions with approval workflows. It features a React frontend with a shadcn/ui design system and an Express.js backend with PostgreSQL database integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **File Storage**: Local file system with multer for uploads
- **Session Management**: Built-in Express session handling

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type-safe sharing between frontend and backend
- **Tables**: 
  - `users` - Admin user authentication
  - `campaigns` - Campaign configuration and metadata
  - `submissions` - Customer photo submissions with approval status

## Key Components

### Database Schema
```typescript
// Core tables with relationships
users: { id, username, password }
campaigns: { id, name, description, rewardType, rewardValue, endDate, status, uniqueUrl }
submissions: { id, campaignId, customerName, phone, imageUrl, status }
```

### API Structure
- **RESTful endpoints** under `/api` prefix
- **File uploads** handled via multer middleware
- **Static file serving** for uploaded images
- **Campaign management** CRUD operations
- **Submission processing** with status updates

### Frontend Pages
- **Admin Dashboard** (`/admin`) - Campaign and submission management
- **Customer Form** (`/c/:uniqueUrl`) - Public campaign submission interface
- **404 Page** - Error handling for invalid routes

### Storage Strategy
Implements PostgreSQL database storage (`DatabaseStorage`) using Drizzle ORM with type-safe queries. Database automatically handles data persistence, relationships, and transactions.

## Data Flow

1. **Campaign Creation**: Admin creates campaigns through dashboard interface
2. **Public Access**: Customers access campaigns via unique URLs
3. **Photo Submission**: Customers upload photos with contact information
4. **File Processing**: Images stored locally with metadata in database
5. **Review Workflow**: Admin reviews and approves/rejects submissions
6. **Status Updates**: Real-time updates via React Query invalidation

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL connection driver
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components foundation
- **react-hook-form**: Form state management
- **zod**: Schema validation
- **multer**: File upload handling

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Fast bundling for production

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev` starts both frontend and backend
- **Port**: Application runs on port 5000
- **Hot Reload**: Vite provides instant updates for frontend changes
- **File Watching**: tsx provides backend restart on changes

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild compiles TypeScript server to `dist/index.js`
- **Static Serving**: Express serves built frontend assets
- **Database**: PostgreSQL connection via environment variables

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Auto-deployment**: Configured for autoscale deployment target
- **Port Mapping**: Internal port 5000 mapped to external port 80

## Current Features and Functionalities

### Core Campaign Management
- **Campaign Creation**: Create photo submission campaigns with customizable rewards and end dates
- **Campaign Dashboard**: View campaign statistics, submission counts, and performance metrics
- **Campaign Status Management**: Active/inactive campaign controls with automatic URL generation
- **Campaign Widget Generator**: Generate embeddable HTML widgets for websites with responsive design

### Customer Management System
- **Customer Database**: Complete customer management with name, phone, email storage
- **Customer Registration**: Manual customer entry and bulk CSV import functionality
- **Customer Search**: Real-time search across customer database by name, phone, or email
- **Duplicate Prevention**: Automatic duplicate detection by phone number
- **Customer Statistics**: Track total customer count in dashboard analytics

### Photo Submission Workflow
- **Public Submission Forms**: Unique campaign URLs for customer photo submissions
- **File Upload Management**: Secure image upload with preview and validation
- **Submission Review**: Admin approval/rejection workflow for all submissions
- **Submission Statistics**: Track pending, approved, and rejected submissions
- **Image Gallery**: Full-size image preview with submission details

### Customer Flyer Generation
- **Multiple Templates**: Three professional flyer designs (Modern, Classic, Fun)
- **QR Code Integration**: Auto-generated QR codes linking to campaign forms
- **Download Options**: SVG flyer downloads for printing and sharing
- **Social Sharing**: Ready-to-use share text for social media promotion
- **Campaign Integration**: Flyers automatically include campaign details and rewards

### Email Communication System
- **Bulk Email Campaigns**: Send promotional emails to customer segments (Currently disabled in UI)
- **SMTP Integration**: Configurable email service with authentication
- **Email Templates**: Professional email templates with campaign details
- **Delivery Tracking**: Monitor email send success and failure rates
- **Customer Targeting**: Send emails to selected customer groups

### Administrative Features
- **Admin Dashboard**: Comprehensive admin interface with tabbed navigation
- **Real-time Statistics**: Live dashboard with campaign and customer metrics
- **Search and Filtering**: Advanced search across campaigns, submissions, and customers
- **Responsive Design**: Mobile-friendly interface for admin and customer use
- **Data Export**: Customer data export via CSV format

### Technical Infrastructure
- **PostgreSQL Database**: Production-ready database with Drizzle ORM
- **File Storage**: Secure local file storage for uploaded images
- **API Architecture**: RESTful API endpoints for all functionality
- **TypeScript Support**: Full type safety across frontend and backend
- **Modern UI Components**: shadcn/ui component library with Tailwind CSS

## Recent Changes

**January 2, 2025** - Bulk Email System Implementation:
- Added nodemailer integration for bulk email campaigns
- Created email service with SMTP configuration support
- Built bulk mailer component with customer selection and email composition
- Added email delivery tracking and error handling
- Integrated email functionality with customer management system
- Email feature currently hidden from navigation pending SMTP configuration

**July 2, 2025** - Customer flyer generator and QR code integration:
- Added customer flyer generator feature with three templates (Modern, Classic, Fun)
- Integrated QR codes that link directly to campaign participation forms
- Created tabbed interface for customers: "Participate" and "Share Campaign"
- Flyers include campaign details, rewards, QR codes, and call-to-action buttons
- Customers can download SVG flyers and copy share text for social media
- Fixed widget generator HTML code generation and API response parsing

**July 2, 2025** - Migration to Replit environment and SMS removal:
- Successfully migrated project from Replit Agent to standard Replit environment
- Created PostgreSQL database and established all table schemas
- Completely removed SMS/Twilio functionality as requested by user
- Replaced bulk messaging with campaign widget generator
- Added website widget feature allowing admins to generate HTML code for embedding campaigns
- Widget includes responsive design with campaign details, rewards, and direct participation links
- Fixed all database connection issues and API endpoints now working properly
- Project now runs cleanly with proper client/server separation and security practices

**June 16, 2025** - Added customer management system and PostgreSQL database:
- Migrated from in-memory storage to PostgreSQL database using Drizzle ORM
- New customers database table with name, phone, email fields  
- Customer API endpoints for CRUD operations and bulk CSV import
- Customers tab in admin dashboard with manual entry form
- CSV import functionality with duplicate handling
- Customer search and management interface
- Updated dashboard stats to include customer count
- All data now persists in PostgreSQL for production reliability

## Architecture Updates

### Database Schema
Added `customers` table:
```typescript
customers: { id, name, phone (unique), email, createdAt }
```

### API Endpoints
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create single customer
- `POST /api/customers/bulk` - Bulk import from CSV
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Frontend Features
- Customer management tab with form and CSV upload
- Search functionality across customer database
- Automatic duplicate prevention by phone number
- Clear CSV format instructions for users

## Changelog

Changelog:
- June 16, 2025. Initial setup with customer management system

## User Preferences

Preferred communication style: Simple, everyday language.