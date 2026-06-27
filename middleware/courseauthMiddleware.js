const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      message: "Authorization header missing" 
    });
  }

  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "No token provided" 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid or expired token",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
    
    req.user = decoded;
    next();
  });
};

const isCourseAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated"
    });
  }

  if (req.user.role === "admin") {
    return next();
  }

  res.status(403).json({ 
    success: false,
    message: "Access denied. Admin privileges required." 
  });
};

module.exports = {
  verifyToken,
  isCourseAdmin
};
