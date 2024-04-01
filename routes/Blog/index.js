const BlogController = require("../../controllers/blog.controller");
const {
  verifyAccessToken,
  checkRoles,
} = require("../../middlewares/verifyToken");

const router = require("express").Router();

router.get("/findall", BlogController.getBlogs);
router.put("/like", verifyAccessToken, BlogController.likeBlog);
router.put("/dislikesss", verifyAccessToken, BlogController.dislikeBlog);
router.get("/findblogbyid", BlogController.getBlogById);
router.delete(
  "/delete/:bId",
  [verifyAccessToken, checkRoles],
  BlogController.deleteBlog
);
module.exports = router;
