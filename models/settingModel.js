const db = require("../config/db");

const Setting = {
  updateProfile: (id, name, email, password) => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE admin SET name = ?, email = ?, password = ? WHERE id = ?";
      db.query(sql, [name, email, password, id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT id, name, email, created_at FROM admin WHERE id = ?";
      db.query(sql, [id], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result[0]);
        }
      });
    });
  }
};

module.exports = Setting;
