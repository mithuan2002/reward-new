# Vercel Deployment Guide for Nambi

## Steps to Deploy on Vercel

### 1. Prepare Your Repository
Make sure all the following files are committed to your Git repository:
- `vercel.json` (deployment configuration)
- `api/index.js` (Vercel serverless function entry point)
- Built files in `dist/` directory (created by `npm run build`)

### 2. Build the Project
Before deploying, run the build command to generate production files:
```bash
npm run build
```

This will create:
- `dist/public/` - Frontend build files
- `dist/index.js` - Backend build file

### 3. Deploy to Vercel

#### Option 1: Using Vercel CLI
```bash
npx vercel
```

#### Option 2: Connect GitHub Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository
4. Vercel will automatically detect the configuration

### 4. Environment Variables (Optional)
If you want to use a real database instead of in-memory storage:
1. In Vercel dashboard, go to your project settings
2. Add environment variables:
   - `DATABASE_URL` - Your PostgreSQL database URL
   - `NODE_ENV` - Set to "production"

### 5. Verification
After deployment, your app should be available at:
- `https://your-project-name.vercel.app`

The app includes:
- Landing page at `/`
- Admin dashboard at `/admin`
- Customer submission forms at `/c/[campaign-url]`

### Troubleshooting

#### Frontend Not Loading
- Make sure `npm run build` was successful
- Check that `dist/public/` contains `index.html` and `assets/` folder
- Verify `vercel.json` routes are correctly configured

#### API Endpoints Not Working
- Ensure `api/index.js` exists and exports the server
- Check that `dist/index.js` was built successfully
- Verify all routes start with `/api/`

#### Current Configuration
- Uses in-memory storage (data resets on deployment)
- All uploads are stored temporarily (will be lost on restart)
- Perfect for demo and testing purposes

### Production Notes
For production use, you'll want to:
1. Set up a persistent PostgreSQL database
2. Configure file storage (AWS S3, Vercel Blob, etc.)
3. Add proper error handling and logging
4. Set up monitoring and analytics

Your app is now ready for deployment! 🚀