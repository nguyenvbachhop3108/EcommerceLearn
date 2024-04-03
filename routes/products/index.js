const uploadCloud = require("../../configs/cloudinary.config");
const ProductController = require("../../controllers/product.controller");
const {
  verifyAccessToken,
  checkRoles,
} = require("../../middlewares/verifyToken");

const router = require("express").Router();

router.get("/:findall", ProductController.getAllProdcut);
router.post(
  "/create",
  [verifyAccessToken, checkRoles],
  ProductController.createProduct
);
router.put("/ratings", verifyAccessToken, ProductController.ratingsProduct);

router.get("/:pId", ProductController.getProductById);
router.delete(
  "/delete/:pId",
  [verifyAccessToken, checkRoles],
  ProductController.deleteProduct
);
router.put(
  "/update/:pId",
  [verifyAccessToken, checkRoles],
  ProductController.updateProduct
);

router.put(
  "/uploadimage/:pId",
  [verifyAccessToken, checkRoles],
  uploadCloud.array("image", 5),
  ProductController.uploadImageProduct
);

module.exports = router;
