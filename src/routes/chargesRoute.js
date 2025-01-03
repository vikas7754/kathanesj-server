const router = require("express").Router();
const chargesController = require("../controllers/chargesController");
const { auth, roleAuth } = require("../middlewares/auth");

router.get("/", chargesController.getCharges);

router.post("/", auth, roleAuth, chargesController.addCharges);

module.exports = router;
