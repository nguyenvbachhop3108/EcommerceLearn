const asyncHandler = require("express-async-handler");
const { Product } = require("../models/product.model");
const { default: slugify } = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing inputs");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Cannot create new product",
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const { pId } = req.params;
  const foundProduct = await Product.findById(pId);
  return res.status(200).json({
    success: foundProduct ? true : false,
    metadata: foundProduct ? foundProduct : "Cannot get product",
  });
});

const getAllProdcut = asyncHandler(async (req, res) => {
  let { ...queries } = req.query;

  //tách các trường đặc biệt ra khỏi queries
  const excludeQueries = ["limit", "sort", "page", "fields"];
  excludeQueries.forEach((el) => delete queries[el]);

  //Format lại các operators cho đúng cú pháp mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (matchEl) => `$${matchEl}`
  );

  Object.keys(queries).forEach((key) => {
    const value = queries[key];
    if (typeof value === "object") {
      Object.keys(value).forEach((operator) => {
        if (["gt", "gte", "lt", "lte"].includes(operator)) {
          queries[key] = { [`$${operator}`]: value[operator] };
        }
      });
    }
  });
  //Filterring
  if (queries?.title) queries.title = { $regex: queries.title, $options: "i" }; //options "i" không phân biệt chữ hoa chữ thường
  let queryCommand = Product.find(queries);

  //Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" "); //abc efg => [abc, efg] => abc efg
    queryCommand = queryCommand.sort(sortBy);
  }

  //Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    queryCommand = queryCommand.select(fields);
  }
  //Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);

  queryCommand
    .then(async (response) => {
      const counts = await Product.countDocuments(queries);
      return res.status(200).json({
        success: true,
        metadata: response || "Cannot get product",
        counts,
      });
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: "Internal Server Error" });
      console.log(err.message);
    });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pId } = req.params;
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const updatedProduct = await Product.findByIdAndUpdate(pId, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updatedProduct ? true : false,
    metadata: updatedProduct ? updatedProduct : "Cannot update product",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pId } = req.params;
  const delProduct = await Product.findByIdAndDelete(pId);
  return res.status(200).json({
    success: delProduct ? true : false,
    metadata: delProduct ? delProduct : "Cannot delete product",
  });
});

const ratingsProduct = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pId, comment, star } = req.body;
  if (!pId || !star) throw new Error("Missing Inputs!");
  const ratingProduct = await Product.findById(pId);
  console.log("🚀 ~ ratingsProduct ~ ratingProduct:", ratingProduct);
  const alreadyRating = ratingProduct?.ratings?.find(
    (el) => el.postedBy === _id
  );
  console.log("🚀 ~ ratingsProduct ~ alreadyRating:", alreadyRating);
  if (alreadyRating) {
    //Update rating before
    await Product.updateOne(
      {
        ratings: { $elemMatch: alreadyRating },
      },
      {
        $set: { "ratings.$.star": star, "rating.$.comment": comment },
      },
      {
        new: true,
      }
    );
  } else {
    await Product.findByIdAndUpdate(
      pId,
      { $push: { ratings: { star, comment, postedBy: _id } } },
      {
        new: true,
      }
    );
  }
  //Sum ratings
  const ratingCount = ratingProduct.ratings.length;
  const sumRating = ratingProduct.ratings.reduce(
    (acc, el) => acc + +el.star,
    0
  );
  ratingProduct.totalRatings = (sumRating / ratingCount).toFixed(1);
  await ratingProduct.save()
  return res.status(200).json({
    success: true,
  });
});

module.exports = {
  createProduct,
  getProductById,
  getAllProdcut,
  updateProduct,
  deleteProduct,
  ratingsProduct,
};
