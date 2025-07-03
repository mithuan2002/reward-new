# Deployment Guide for Render

## IMPORTANT: You MUST create the database FIRST, then the web service

## Step 1: Create a PostgreSQL Database on Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Click "New +" and select "PostgreSQL"
3. Choose a name for your database (e.g., "nambi-db")
4. Select the free tier
5. Click "Create Database"
6. **WAIT** for the database to be fully created (this can take 2-3 minutes)
7. Once created, go to your database dashboard
8. Copy the "External Database URL" - it looks like:
   `postgresql://username:password@hostname:port/database_name`

## Step 2: Deploy the Web Service

1. Go to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: nambi-app (or your preferred name)
   - **Environment**: Node
   - **Region**: Choose your preferred region  
   - **Branch**: main
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

## Step 3: Set Environment Variables (CRITICAL STEP)

In your web service settings, go to the "Environment" tab and add:

- **Key**: `DATABASE_URL`
- **Value**: Paste the EXACT External Database URL from Step 1

Example DATABASE_URL format:
```
postgresql://user:password@hostname:5432/database_name
```

**IMPORTANT**: Make sure there are no extra spaces or characters when pasting the URL!

## Step 4: Deploy

Click "Create Web Service" and wait for the deployment to complete.

## Important Notes

- The application will automatically run database migrations on startup
- Make sure your GitHub repository is up to date with all your changes
- The free tier on Render may have some limitations on uptime
- Monitor the deployment logs for any issues

## Troubleshooting "DATABASE_URL not set" Error

### The Most Common Issue: Wrong Order of Operations

**❌ WRONG WAY:**
1. Create web service first
2. Try to add DATABASE_URL later

**✅ CORRECT WAY:**
1. Create PostgreSQL database FIRST
2. Wait for it to be fully created
3. Copy the External Database URL
4. THEN create web service
5. Add DATABASE_URL during web service creation

### Step-by-Step Fix:

1. **Go to your database**: https://dashboard.render.com
2. **Find your PostgreSQL database** (should be listed)
3. **Click on your database name**
4. **Copy the "External Database URL"** (not Internal!)
5. **Go to your web service settings**
6. **Click "Environment" tab**
7. **Add new environment variable:**
   - Key: `DATABASE_URL`
   - Value: [paste the URL here]
8. **Save and redeploy**

### Double-Check Your Database URL Format:

Your DATABASE_URL should look like this:
```
postgresql://username:password@hostname:5432/database_name
```

**Common mistakes:**
- Using Internal Database URL instead of External
- Extra spaces before/after the URL
- Missing parts of the URL
- Wrong database name

### If It Still Doesn't Work:

1. Delete your web service
2. Make sure your database is running
3. Create a new web service
4. Add the DATABASE_URL from the start

The error happens because Render needs the database to exist BEFORE the web service tries to connect to it.