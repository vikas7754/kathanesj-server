const router = require("express").Router();
const enquiryController = require("../controllers/enquiryController");

router.post("/", enquiryController.addEnquiry);
router.get("/", enquiryController.getEnquiries);

module.exports = router;
