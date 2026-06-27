let jwt = require("jsonwebtoken");
let verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send({ message: "access denied, token missing" });
  }
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "invalid token" });
    }
    req.user = decoded;
    next();
  });
};
let isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).send({ message: "admin access only" });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};
