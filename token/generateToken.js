let jwt = require("jsonwebtoken");

let token = jwt.sign(
  { id: 1, email: "admin@example.com", role: "admin" },
  "secretkey",  // must match the key in your auth middleware
  { expiresIn: "24h" } // or "1h" for 1 hour
);

console.log("Generated JWT:\n");
console.log(token);
