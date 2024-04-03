const asyncHandler = require("express-async-handler");
const { Coupon } = require("../models/coupon.model");

const createCoupon = asyncHandler(async (req, res) => {
  const { title, discount, expiry } = req.body;
  if (!title || !discount || !expiry) throw new Error("Missing Input");
  const response = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success: true,
    metadata: response ? response : "Cannot create coupon",
  });
});

const getCoupon = asyncHandler(async (req, res) => {
  const response = await Coupon.find();
  return res.status(200).json({
    success: response ? true : false,
    metadata: response ? response : "Cannot get coupon",
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { cId } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  if (req.body.expiry)
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  const response = await Coupon.findByIdAndUpdate(cId, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: response ? true : false,
    metadata: response ? response : "Cannot update coupon",
  });
});
const deleteCoupon = asyncHandler(async (req, res) => {
  const { cId } = req.params;
  const response = await Coupon.findByIdAndDelete(cId);
  return res.status(200).json({
    success: response ? true : false,
    metadata: response ? response : "Cannot delete coupon",
  });
});

module.exports = { createCoupon, getCoupon, deleteCoupon, updateCoupon };
