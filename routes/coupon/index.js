const CouponController = require("../../controllers/coupon.controller");
const {
  verifyAccessToken,
  checkRoles,
} = require("../../middlewares/verifyToken");

const router = require("express").Router();

//router.get("/:findall", ProductController.getAllProdcut);
router.post(
  "/create",
  [verifyAccessToken, checkRoles],
  CouponController.createCoupon
);
router.put(
  "/update/:cId",
  [verifyAccessToken, checkRoles],
  CouponController.updateCoupon
);

module.exports = router;
