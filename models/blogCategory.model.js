const { model, Schema, Types, default: mongoose } = require("mongoose");

const DOCUMANT_NAME = "BlogCategory";
const COLLECTION_NAME = "BlogsCategory";

const blogCategorySchema = new Schema(
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

module.exports = { BlogCategory: model(DOCUMANT_NAME, blogCategorySchema) };
