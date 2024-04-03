const expressAsyncHandler = require("express-async-handler");
const { User } = require("../models/user.model");
const { Order } = require("../models/order.model");
const { Coupon } = require("../models/coupon.model");
const { toObjId } = require("../utils/index");

const createOrder = expressAsyncHandler(async (req, res) => {
  const _id = req.user.userId;
  const { coupon } = req.body;
  const userCart = await User.findById(_id)
    .select("cart")
    .populate("cart.product", "title price");

  const products = userCart?.cart?.map((el) => ({
    product: el.product._id,
    count: el.quantity,
    color: el.color,
  }));

  let total = userCart?.cart?.reduce(
    (acc, el) => el.product.price * el.quantity + acc,
    0
  );

  const createData = { products, total, orderBy: _id };

  if (coupon) {
    const selectedCoupon = await Coupon.findById(coupon);
    total =
      Math.round((total * (1 - +selectedCoupon?.discount / 100)) / 1000) * 1000;
    createData.total = total;
    createData.coupon = coupon;
  }
  const response = Order.create(createData);
  return res.status(200).json({
    message: response ? true : false,
    metadata: response ? response : "Something went wrong",
  });
});

const updateOrderStatus = expressAsyncHandler(async (req, res) => {
  const { oId } = req.params;
  const { status } = req.body;

  const response = await Order.findByIdAndUpdate(
    oId,
    { status },
    { new: true }
  );
  return res.status(200).json({
    message: response ? true : false,
    metadata: response ? response : "Something went wrong",
  });
});

const getUserOrder = expressAsyncHandler(async (req, res) => {
  const uId = req.user.userId;

  const response = await Order.find({ orderBy: uId });
  return res.status(200).json({
    message: response ? true : false,
    metadata: response ? response : "Something went wrong",
  });
});

const getAllOrder = expressAsyncHandler(async (req, res) => {
  const uId = req.user.userId;

  const response = await Order.find();
  return res.status(200).json({
    message: response ? true : false,
    metadata: response ? response : "Something went wrong",
  });
});

module.exports = { createOrder, updateOrderStatus, getUserOrder,getAllOrder };
