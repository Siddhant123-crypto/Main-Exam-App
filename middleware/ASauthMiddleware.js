const jwt = require("jsonwebtoken");

// use env secret in production; fallback to 'secretkey' for quick local tests
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

exports.verifyToken = function (req, res, next) {
  // Accept header in form "Bearer <token>" or raw token
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Token required" });
  }

  // If header is "Bearer <token>", split and take second part
  let token = authHeader;
  if (typeof authHeader === "string" && authHeader.split(" ").length === 2) {
    const parts = authHeader.split(" ");
    if (parts[0].toLowerCase() === "bearer") token = parts[1];
  }

  // optional: quick logging to debug
  // console.log("VERIFY TOKEN:", token);

  jwt.verify(token, JWT_SECRET, function (err, decoded) {
    if (err) {
      // you can send err.message to get 'jwt expired' etc.
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

exports.isAdmin = function (req, res, next) {
  if (req.user && req.user.role === "admin") next();
  else res.status(403).json({ message: "Admin only" });
};

exports.isStudent = function (req, res, next) {
  if (req.user && (req.user.role === "student" || req.user.role === "admin")) next();
  else res.status(403).json({ message: "Student only" });
};
