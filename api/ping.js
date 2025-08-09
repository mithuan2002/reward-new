// Absolutely minimal test - no dependencies
module.exports = (req, res) => {
  res.status(200).json({ message: "pong", timestamp: Date.now() });
};