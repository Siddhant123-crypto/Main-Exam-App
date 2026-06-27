let express = require("express");
let router = express.Router();

let scheduleController = require("../controllers/scheduleController");
let { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.post("/add", verifyToken, isAdmin, scheduleController.createSchedule);
router.get("/view", verifyToken, isAdmin, scheduleController.getAllSchedules);
router.get("/search", verifyToken, isAdmin, scheduleController.searchScheduleByDate);
router.get("/:id", verifyToken, isAdmin, scheduleController.getScheduleById);

router.put("/update/:id", verifyToken, isAdmin, scheduleController.updateSchedule);
router.delete("/delete/:id", verifyToken, isAdmin, scheduleController.deleteSchedule);

module.exports = router;
