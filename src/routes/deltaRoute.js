const router = require("express").Router();
const deltaController = require("../controllers/deltaController");

router.post("/", deltaController.addDelta);
router.put("/", deltaController.updateDelta);
router.delete("/:product", deltaController.deleteDelta);
router.get("/:product", deltaController.getDelta);
router.get("/", deltaController.getAllDelta);

module.exports = router;
