const asyncHandler = require("express-async-handler");
const { Blog } = require("../models/blog.model");

const createNewBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    throw new Error("Missing Input");
  }
  const response = await Blog.create(req.body);
  return res.status(200).json({
    success: true,
    metadata: response ? response : "Cannot create Blog",
  });
});

const updatedBlog = asyncHandler(async (req, res) => {
  const { blId } = req.params;
  if (Object.keys(req.body).length === 0) {
    throw new Error("Missing Input");
  }
  const response = await Blog.findByIdAndUpdate(blId, req.body, { new: true });
  return res.status(200).json({
    success: response ? true : false,
    metadata: response ? response : "Cannot update blog",
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { bId } = req.params;
  const response = await Blog.findByIdAndDelete(bId);
  return res.status(200).json({
    success: response ? true : false,
    metadata: response ? response : "Cannot delete blog",
  });
});

const getBlogs = asyncHandler(async (req, res) => {
  const response = await Blog.find();
  return res.status(200).json({
    success: response ? true : false,
    metadata: response ? response : "Cannot get blogs",
  });
});

/*
Khi người dung like một bài blog thì :
1. Check xem người đó trước đó đã dislike hay không => bỏ dislike
2. Check xem người đó có like hay không => bỏ like / thêm like
*/

const likeBlog = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { bId } = req.query;
  // Find the blog
  const blog = await Blog.findById(bId);
  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }

  // Check if user has already disliked the blog
  const isDisliked = blog.dislikes ? blog.dislikes.includes(userId) : false;

  if (isDisliked) {
    const response = await Blog.findByIdAndUpdate(
      bId,
      { $pull: { dislikes: userId } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      metadata: response,
    });
  }

  // Check if user has already liked the blog
  const isLiked = blog.likes ? blog.likes.includes(userId) : false;

  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      bId,
      { $pull: { likes: userId } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      metadata: response,
    });
  } else {
    // If user has not liked the blog, add like
    const response = await Blog.findByIdAndUpdate(
      bId,
      { $push: { likes: userId } },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      metadata: response,
    });
  }
});

/**
 khi người dùng dislike một bài blog:
 1. Check xem người đó đã like chưa nếu rồi thì => bỏ like
 2. Check xem người đó đã dislike chưa nếu rồi => hủy dislike / thêm dislike
 */

const dislikeBlog = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { blId } = req.body;
  if (!blId) throw new Error("Missing Input!");

  const blog = await Blog.findById(blId);
  if (!blog) throw new Error("Blog not found");

  const isLiked = blog.likes ? blog.likes.includes(userId) : false;
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      blId,
      { $pull: { likes: userId } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      metadata: response,
    });
  }
  const isDisliked = blog.dislikes ? blog.dislikes.includes(userId) : false;
  if (isDisliked) {
    const response = await Blog.findByIdAndUpdate(
      blId,
      { $pull: { dislikes: userId } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      metadata: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      blId,
      { $push: { dislikes: userId } },
      { new: true }
    );
    return res.status(200).json({
      success: response ? true : false,
      metadata: response,
    });
  }
});

// const updateBlogReaction = async (blogId, userId, updateField, operation) => {
//   const updatePayload =
//     operation === "pull"
//       ? { $pull: { [updateField]: userId } }
//       : { $push: { [updateField]: userId } };
//   const response = await Blog.findByIdAndUpdate(blogId, updatePayload, {
//     new: true,
//   });
//   return response;
// };

// const handleBlogReaction = async (req, res, updateField, oppositeField) => {
//   const { userId } = req.user;
//   const { bId } = req.body;
//   if (!bId) throw new Error("Missing Input!");

//   const blog = await Blog.findById(bId);
//   if (!blog) throw new Error("Blog not found");

//   const isInOppositeField = blog[oppositeField]
//     ? blog[oppositeField].includes(userId)
//     : false;
//   if (isInOppositeField) {
//     await updateBlogReaction(bId, userId, oppositeField, "pull");
//   }

//   const response = await updateBlogReaction(bId, userId, updateField, "toggle");
//   return res.status(200).json({
//     success: response ? true : false,
//     metadata: response,
//   });
// };

// // const likeBlog = asyncHandler(async (req, res) => {
// //   await handleBlogReaction(req, res, "likes", "dislikes");
// // });

// // const dislikeBlog = asyncHandler(async (req, res) => {
// //   await handleBlogReaction(req, res, "dislikes", "likes");
// // });

const exlcudeFields = "-refreshToken -password -role - createAt -updatedAt";
const getBlogById = asyncHandler(async (req, res) => {
  const { bId } = req.body;
  const blog = await Blog.findByIdAndUpdate(
    bId,
    { inc: { numberView: 1 } },
    { new: true }
  )
    .populate("likes", "firstname lastname")
    .populate("dislikes", "firstname lastname");
  return res.status(200).json({
    success: blog ? true : false,
    metadata: blog ? blog : "Cannot get blog",
  });
});


module.exports = {
  getBlogs,
  deleteBlog,
  createNewBlog,
  updatedBlog,
  likeBlog,
  dislikeBlog,
  getBlogById,
};
