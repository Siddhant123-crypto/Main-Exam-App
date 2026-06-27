const jwt = require("jsonwebtoken");

let verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Access denied. Token missing." });
  }

  // Remove "Bearer "
  token = token.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    // decoded will contain { id, email } from login
    req.user = decoded;
    next();
  });
};

// ✅ Since only admins exist in `admin` table, no need to check role
let isAdmin = (req, res, next) => {
  if (req.user && req.user.id) {
    next();
  } else {
    res.status(403).json({ message: "Only admin can access this route" });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};
