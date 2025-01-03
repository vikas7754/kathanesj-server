const router = require("express").Router();
const updateController = require("../controllers/updatesController");

router.post("/", updateController.addUpdate);
router.put("/:id", updateController.updateUpdate);
router.delete("/:id", updateController.deleteUpdate);
router.get("/", updateController.getUpdates);

module.exports = router;
