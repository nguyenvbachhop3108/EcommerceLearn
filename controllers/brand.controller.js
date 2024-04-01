const asyncHandler = require("express-async-handler");
const { Brand } = require("../models/brand.model");

const createBrand = asyncHandler(async (req, res) => {
  const response = await Brand.create(req.body);
  return res.status(200).json({
    success: true,
    metadata: response ? response : "Cannot create category",
  });
});

const getBrands = asyncHandler(async (req, res) => {
  const response = await Brand.find()
  return res.status(200).json({
    success:response ? true : false,
    metadata: response ? response : "Cannot get categories"
  })
});

const updateBrand = asyncHandler(async(req,res) =>{
  const {brId} =req.params
  const response = await Brand.findByIdAndUpdate(brId,req.body,{new:true})
  return res.status(200).json({
    success:response ? true : false,
    metadata: response ? response : "Cannot update categories"
  })
})
const deleteBrand = asyncHandler(async(req,res) =>{
  const {brId} =req.params
  const response = await Brand.findByIdAndDelete(brId)
  return res.status(200).json({
    success:response ? true : false,
    metadata: response ? response : "Cannot delete categories"
  })
})

module.exports = { createBrand,getBrands,updateBrand,deleteBrand };
