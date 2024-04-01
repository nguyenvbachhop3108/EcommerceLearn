const { model, Schema, Types, default: mongoose } = require("mongoose");

const DOCUMANT_NAME = "Category";
const COLLECTION_NAME = "Categories";

const productCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index:true

    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { Category: model(DOCUMANT_NAME, productCategorySchema) };
