const db = require("../config/db");

const Teacher = {
  // ✅ Create
  create: (data) => {
    return new Promise((resolve, reject) => {
      const sql = "INSERT INTO teacher (teach_name, teach_email, password, dob, mobile, role) VALUES (?, ?, ?, ?, ?, ?)";
      db.query(
        sql,
        [data.teach_name, data.teach_email, data.password, data.dob, data.mobile, data.role],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  },

  // ✅ Get all
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM teacher", (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },

  // ✅ Get by id
  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM teacher WHERE tid = ?", [id], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });
  },

  // ✅ Update
  update: (id, data) => {
    return new Promise((resolve, reject) => {
      const sql = "UPDATE teacher SET teach_name=?, teach_email=?, dob=?, mobile=?, role=? WHERE tid=?";
      db.query(
        sql,
        [data.teach_name, data.teach_email, data.dob, data.mobile, data.role, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  },

  // ✅ Delete
  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query("DELETE FROM teacher WHERE tid = ?", [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },
};

module.exports = Teacher;
