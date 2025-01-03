const router = require("express").Router();
const headerController = require("../controllers/headerController");
const { auth, roleAuth } = require("../middlewares/auth");

router.get("/", headerController.getHeader);

router.post("/", auth, roleAuth, headerController.updateHeader);

module.exports = router;
