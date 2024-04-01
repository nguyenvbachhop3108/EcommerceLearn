const asyncHandler = require("express-async-handler");
const { BlogCategory } = require("../models/blogCategory.model");

const createBlog = asyncHandler(async (req, res) => {
  const response = await BlogCategory.create(req.body);
  return res.status(200).json({
    success: true,
    metadata: response ? response : "Cannot create category",
  });
});

const getBlogs = asyncHandler(async (req, res) => {
  const response = await BlogCategory.find()
  return res.status(200).json({
    success:response ? true : false,
    metadata: response ? response : "Cannot get categories"
  })
});

const updateBlog = asyncHandler(async(req,res) =>{
  const {bId} =req.params
  const response = await BlogCategory.findByIdAndUpdate(bId,req.body,{new:true})
  return res.status(200).json({
    success:response ? true : false,
    metadata: response ? response : "Cannot update categories"
  })
})
const deleteBlog = asyncHandler(async(req,res) =>{
  const {bId} =req.params
  const response = await BlogCategory.findByIdAndDelete(bId)
  return res.status(200).json({
    success:response ? true : false,
    metadata: response ? response : "Cannot delete categories"
  })
})

module.exports = { createBlog,getBlogs,updateBlog,deleteBlog };
