// routes/resultRoutes.js
const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");

// CRUD routes
router.post("/add", resultController.createResult);
router.get("/view", resultController.getAllResults);
router.get("/view/:id", resultController.getResultById);
router.put("/update/:id", resultController.updateResult);
router.delete("/delete/:id", resultController.deleteResult);
router.get("/my-results", resultController.getMyResults);
module.exports = router;
