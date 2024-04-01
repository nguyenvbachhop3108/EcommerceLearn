const ProductCategoryController = require("../../controllers/productCategory.controller");
const {
  verifyAccessToken,
  checkRoles,
} = require("../../middlewares/verifyToken");

const router = require("express").Router();

router.get("/findall", ProductCategoryController.getCategories);
router.post(
  "/create",
  [verifyAccessToken, checkRoles],
  ProductCategoryController.createCategory
);
router.put(
  "/update/:cpId",
  [verifyAccessToken, checkRoles],
  ProductCategoryController.updateCategory
);
router.delete(
  "/delete/:cpId",
  [verifyAccessToken, checkRoles],
  ProductCategoryController.deleteCategory
);

module.exports = router;
