let jwt = require("jsonwebtoken");

// Middleware to verify JWT token
let verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    res.status(403).send({ message: "Token required" });
    return;
  }

  // Remove "Bearer " prefix if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  jwt.verify(token, "secretkey", (err, decoded) => {
    if (err) {
      res.status(401).send({ message: "Invalid token" });
    } else {
      req.user = decoded;
      next();
    }
  });
};

// Middleware to allow only admins
let isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).send({ message: "Access denied: Admins only" });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};
