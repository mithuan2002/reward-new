# Free Deployment on Vercel + Neon Database

This guide will help you deploy your app completely free using Vercel for hosting and Neon for PostgreSQL database.

## Step 1: Set Up Free Database (Neon)

1. **Go to Neon**: https://neon.tech
2. **Sign up for free** with GitHub
3. **Create a new project**:
   - Project name: "nambi-db"
   - Region: Choose closest to you
   - Click "Create Project"
4. **Get your database URL**:
   - Go to "Dashboard"
   - Click "Connection Details"
   - Copy the "Connection string" (starts with `postgresql://`)
   - Save this URL - you'll need it for Vercel

## Step 2: Prepare Your Project for Vercel

1. **Push your code to GitHub** (if not already done)
2. **Make sure your repository is public** (required for Vercel free tier)

## Step 3: Deploy on Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up for free** with GitHub
3. **Import your project**:
   - Click "New Project"
   - Select your GitHub repository
   - Click "Import"

4. **Configure deployment**:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: dist/public
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add: `DATABASE_URL` = [paste your Neon database URL]
   - Add: `NODE_ENV` = `production`

6. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete

## Step 4: Configure Custom Start Script

Vercel needs a specific configuration. The deployment will create your app at a URL like:
`https://your-project-name.vercel.app`

## Important Notes:

✅ **Both Vercel and Neon are completely free**
✅ **No credit card required**
✅ **Generous free tiers**
✅ **Professional hosting quality**

## Troubleshooting:

If build fails:
1. Check build logs in Vercel dashboard
2. Ensure DATABASE_URL is correctly set
3. Make sure your GitHub repo has latest code

## Free Tier Limits:

**Vercel Free:**
- 100GB bandwidth/month
- 100 deployments/day
- Custom domains included

**Neon Free:**
- 512MB storage
- 1 database
- No time limits

These limits are more than enough for your customer loyalty app!