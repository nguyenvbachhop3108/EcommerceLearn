const OrderController = require("../../controllers/order.controller");
const {
  verifyAccessToken,
  checkRoles,
} = require("../../middlewares/verifyToken");

const router = require("express").Router();

router.post("/createorder", verifyAccessToken, OrderController.createOrder);
router.get(
  "/getallorder",
  [verifyAccessToken, checkRoles],
  OrderController.getAllOrder
);
router.get("/getorder/:uId", verifyAccessToken, OrderController.getUserOrder);
router.put(
  "/updateorderstatus/:oId",
  [verifyAccessToken, checkRoles],
  OrderController.updateOrderStatus
);

module.exports = router;
