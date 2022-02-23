const { Router } = require("express");
const imageController = require("../controllers/imageController");
const { gfs, storage, upload } = require("../middleware/imageMiddleware");
const methodOverride = require("method-override");

const router = Router();

router.use(methodOverride("_method"));

router.post("/upload", upload.single("file"), imageController.image_up);

router.get("/files/:filename", imageController.file_display);

router.get("/image/:filename", imageController.image_display);

router.delete("/files/:id", imageController.image_delete);

router.post(
  "/profile/upload",
  upload.single("file"),
  imageController.profile_image_up
);

router.delete("/profile_image/:id", imageController.profile_image_delete);

module.exports = router;
