# Deployment Guide for Render

## Step 1: Create a PostgreSQL Database on Render

1. Go to your Render dashboard
2. Click "New +" and select "PostgreSQL"
3. Choose a name for your database (e.g., "nambi-db")
4. Select the free tier
5. Click "Create Database"
6. Wait for the database to be created
7. Copy the "External Database URL" from the database info page

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

## Step 3: Set Environment Variables

In your web service settings, add these environment variables:

- **DATABASE_URL**: Paste the External Database URL from Step 1
- **NODE_ENV**: production

## Step 4: Deploy

Click "Create Web Service" and wait for the deployment to complete.

## Important Notes

- The application will automatically run database migrations on startup
- Make sure your GitHub repository is up to date with all your changes
- The free tier on Render may have some limitations on uptime
- Monitor the deployment logs for any issues

## Troubleshooting

If deployment fails:
1. Check the build logs for specific error messages
2. Ensure all dependencies are listed in package.json
3. Verify the DATABASE_URL is correctly set
4. Check that the start command matches your package.json scripts