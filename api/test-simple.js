// Ultra-simple test with proper Vercel export
export default function handler(req, res) {
  res.status(200).json({ message: "working", timestamp: Date.now() });
}