const { Router } = require("express");
const taskController = require("../controllers/taskController");

const router = Router();

router.post("/dashboard", taskController.task_post);

router.delete("/dashboard/:id", taskController.task_delete);

router.post("/dashboard/:id", taskController.task_update);

module.exports = router;
