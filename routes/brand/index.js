const BrandController = require("../../controllers/brand.controller");
const {
  verifyAccessToken,
  checkRoles,
} = require("../../middlewares/verifyToken");

const router = require("express").Router();

router.get("/findall", BrandController.getBrands);
router.post(
  "/create",
  [verifyAccessToken, checkRoles],
  BrandController.createBrand
);
router.put(
  "/update/brId",
  [verifyAccessToken, checkRoles],
  BrandController.updateBrand
);
router.delete(
  "/delete/brId",
  [verifyAccessToken, checkRoles],
  BrandController.deleteBrand
);

module.exports = router;
