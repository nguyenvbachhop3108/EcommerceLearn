const asyncHandler = require("express-async-handler");
const { Category } = require("../models/productCategory.model");

const createCategory = asyncHandler(async (req, res) => {
  const response = await Category.create(req.body);
  return res.status(200).json({
    success: true,
    metadata: response ? response : "Cannot create category",
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const response = await Category.find()
  return res.status(200).json({
    success:response ? true : false,
    metadata: response ? response : "Cannot get categories"
  })
});

const updateCategory = asyncHandler(async(req,res) =>{
  const {cpId} =req.params
  const response = await Category.findByIdAndUpdate(cpId,req.body,{new:true})
  return res.status(200).json({
    success:response ? true : false,
    metadata: response ? response : "Cannot update categories"
  })
})
const deleteCategory = asyncHandler(async(req,res) =>{
  const {cpId} =req.params
  const response = await Category.findByIdAndDelete(cpId)
  return res.status(200).json({
    success:response ? true : false,
    metadata: response ? response : "Cannot delete categories"
  })
})

module.exports = { createCategory,getCategories,updateCategory,deleteCategory };
