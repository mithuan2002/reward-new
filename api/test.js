// Simple test endpoint for Vercel
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Test basic functionality
    const timestamp = new Date().toISOString();
    
    // Test environment variables
    const hasDbUrl = !!process.env.DATABASE_URL;
    
    // Test database connection if available
    let dbStatus = 'not tested';
    if (hasDbUrl) {
      try {
        const postgres = require('postgres');
        const sql = postgres(process.env.DATABASE_URL, {
          ssl: { rejectUnauthorized: false },
          max: 1,
          idle_timeout: 5,
        });
        
        const result = await sql`SELECT 1 as test`;
        dbStatus = result.length > 0 ? 'connected' : 'failed';
        await sql.end();
      } catch (dbError) {
        dbStatus = `error: ${dbError.message}`;
      }
    }

    return res.status(200).json({
      message: 'Vercel function working',
      timestamp,
      environment: process.env.NODE_ENV || 'unknown',
      hasDbUrl,
      dbStatus,
      method: req.method,
      url: req.url
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Function failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}