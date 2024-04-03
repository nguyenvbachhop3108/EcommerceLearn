const { model, Schema, default: mongoose } = require("mongoose");
const userModel = require("./user.model");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderShema = new Schema(
  {
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        count: Number,
        color: String,
      },
    ],
    status: {
      type: String,
      default: "Processing",
      enum: ["Cancelied", "Processing", "Success"],
    },
    total: Number,
    coupon: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
    orderBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { Order: model(DOCUMENT_NAME, orderShema) };
