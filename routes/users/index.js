const UserController = require("../../controllers/users.controllers");
const {
  verifyAccessToken,
  checkRoles,
} = require("../../middlewares/verifyToken");

const router = require("express").Router();

router.get("/forgotpassword", UserController.forgotPassword);
router.post("/resetpassword", UserController.resetPassword);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current", verifyAccessToken, UserController.getCurrent); //By Admin
router.post(
  "/refreshToken",
  verifyAccessToken,
  UserController.handleRefreshToken
);
router.get("/logout", verifyAccessToken, UserController.logout);
router.get("/", [verifyAccessToken, checkRoles], UserController.getAllUser);
router.delete("/", [verifyAccessToken, checkRoles], UserController.deleteUser);
router.put("/current", verifyAccessToken, UserController.updateUser);
router.put(
  "/:_id",
  [verifyAccessToken, checkRoles],
  UserController.updateUserByAdmin
);
router.put(
  "/update/:bid",
  [verifyAccessToken],
  UserController.updateUserAddress
);
router.put(
  "",
  [verifyAccessToken],
  UserController.addToCart
);

module.exports = router;
