const { Router } = require("express");
const {
  requireAuth,
  loggedIn,
  checkUser,
} = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

const router = Router();

router.get("/signup", loggedIn, authController.signup_get);

router.post("/signup", authController.signup_post);

router.get("/login", loggedIn, authController.login_get);

router.post("/login", authController.login_post);

router.get("/logout", authController.logout_get);

router.post("/profile/:id", authController.profile_update);

router.post("/course/fbf/:id", authController.fbf_update);
router.post("/course/front/:id", authController.front_update);
router.post("/course/back/:id", authController.back_update);

module.exports = router;
