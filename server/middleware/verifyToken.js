const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // ১. প্রথমে Authorization Header থেকে Token চেক করুন
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    // ২. যদি Header-এ না থাকে, তবে Cookie থেকে চেক করুন (Fallback)
    const cookieToken = req.cookies?.token;
    const finalToken = token || cookieToken;

    if (!finalToken) {
      return res.status(401).json({ message: "Unauthorized Access: No token provided" });
    }

    const decoded = jwt.verify(finalToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = verifyToken;