const db = require("../config/db");

const Admin = {
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM admin WHERE email = ?";
      db.query(sql, [email], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });
  }
};

module.exports = Admin;
