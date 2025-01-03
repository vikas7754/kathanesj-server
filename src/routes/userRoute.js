const router = require("express").Router();
const userController = require("../controllers/userController");
const { auth, roleAuth } = require("../middlewares/auth");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.get("/me", userController.me);
router.get("/get-users", userController.getUsers);
router.get("/export", userController.exportUsers);
router.put("/profile", auth, roleAuth, userController.updateProfile);
router.post("/forgot-password-request", userController.forgotPasswordRequest);
router.post("/forgot-password", userController.forgotPassword);
router.post("/upload-image", userController.uploadSingleImage);

module.exports = router;
