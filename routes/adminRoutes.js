
const express = require("express");
const router = express.Router();
const { adminRegister, adminLogin } = require("../controllers/adminController");

// Admin register
router.post("/register", adminRegister);

// Admin login
router.post("/login", adminLogin);

module.exports = router;