const router = require("express").Router();
const productController = require("../controllers/productController");

router.post("/add", productController.addProduct);
router.put("/update/:id", productController.updateProduct);
router.put("/updateShow/:id", productController.updateShowProduct);
router.delete("/delete/:id", productController.deleteProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

module.exports = router;
