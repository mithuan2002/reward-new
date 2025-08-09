// Ultra-minimal function with zero dependencies
module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.status(200).json({ 
    status: "success",
    message: "Function working!", 
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    hasDbUrl: !!process.env.DATABASE_URL
  });
};