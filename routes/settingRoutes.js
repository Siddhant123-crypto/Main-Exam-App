const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/settingController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// Protect an endpoint
router.get("/admin/profile", verifyToken, isAdmin, getProfile);

// Update admin settings
router.put("/admin/update", verifyToken, isAdmin, updateProfile);


module.exports = router;
