const settingModel = require("../models/settingModel");

// ✅ Update admin profile
exports.updateProfile = (req, res) => {
  const adminId = req.user.id; // from token
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  settingModel.updateProfile(adminId, name, email, password)
    .then(() => {
      settingModel.getUserById(adminId)
        .then(admin => {
          if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
          }
          res.status(200).json({
            message: "Profile updated successfully",
            admin,
          });
        })
        .catch(err => res.status(500).json({ message: err.message }));
    })
    .catch(err => res.status(500).json({ message: err.message }));
};

// ✅ Fetch admin profile
exports.getProfile = (req, res) => {
  const adminId = req.user.id; // from token

  settingModel.getUserById(adminId)
    .then(admin => {
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      res.status(200).json(admin);
    })
    .catch(err => res.status(500).json({ message: err.message }));
};
