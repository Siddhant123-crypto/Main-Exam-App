let db = require("../config/db");
let jwt = require("jsonwebtoken");

// ✅ Admin Register
let adminRegister = (req, res) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // check if admin already exists
  let checkQuery = "SELECT * FROM admin WHERE email = ?";
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Error checking admin" });

    if (results.length > 0) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // insert new admin
    let insertQuery = "INSERT INTO admin (name, email, password) VALUES (?, ?, ?)";
    db.query(insertQuery, [name, email, password], (err, result) => {
      if (err) return res.status(500).json({ message: "Error registering admin" });

      res.json({ message: "Admin registered successfully", adminId: result.insertId });
    });
  });
};

// ✅ Admin Login
let adminLogin = (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  let query = "SELECT * FROM admin WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Error during login" });

    if (results.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let admin = results[0];
    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate token with role 'admin'
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: "admin"
      },
      process.env.JWT_SECRET || "your_secret_key",
      { expiresIn: "12h" }
    );

    const { password: _, ...adminData } = admin;
    res.json({
      message: "Admin login successful",
      token,
      admin: adminData
    });
  });
};

module.exports = { adminRegister, adminLogin };
