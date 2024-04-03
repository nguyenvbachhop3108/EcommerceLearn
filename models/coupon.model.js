const { model, Schema } = require("mongoose");

const DOCUMANT_NAME = "Coupon";
const COLLECTION_NAME = "Coupons";

const couponSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { Coupon: model(DOCUMANT_NAME, couponSchema) };
