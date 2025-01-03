const router = require("express").Router();
const detailsController = require("../controllers/detailsController");

router.post("/", detailsController.addDetails);
router.get("/", detailsController.getDetails);
router.put("/", detailsController.updateDetails);
router.delete("/", detailsController.deleteDetails);

module.exports = router;
