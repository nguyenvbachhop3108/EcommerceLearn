const BlogCategoryController = require("../../controllers/blogCategory.controller");
const {
  verifyAccessToken,
  checkRoles,
} = require("../../middlewares/verifyToken");

const router = require("express").Router();

router.get("/findall", BlogCategoryController.getBlogs);
router.post(
  "/create",
  [verifyAccessToken, checkRoles],
  BlogCategoryController.createBlog
);
router.put(
  "/update/:cpId",
  [verifyAccessToken, checkRoles],
  BlogCategoryController.updateBlog
);
router.delete(
  "/delete/:cpId",
  [verifyAccessToken, checkRoles],
  BlogCategoryController.deleteBlog
);

module.exports = router;
