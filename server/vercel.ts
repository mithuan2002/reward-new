// Vercel-specific entry point - this exports to api/index.js instead
// The actual Vercel handler is in api/index.js for serverless compatibility
export default function handler(req: any, res: any) {
  res.status(404).json({ 
    message: 'This endpoint is deprecated. Vercel functions are now in /api/index.js' 
  });
}