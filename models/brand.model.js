const { model, Schema } = require("mongoose");

const DOCUMANT_NAME = "Brand";
const COLLECTION_NAME = "Brands";

const brandSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { Brand: model(DOCUMANT_NAME, brandSchema) };
