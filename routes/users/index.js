const  UserController  = require("../../controllers/users.controllers");
const { verifyAccessToken } = require("../../middlewares/verifyToken");

const router = require("express").Router();

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/current", verifyAccessToken, UserController.getCurrent) //By Admin
router.post("/refreshToken",verifyAccessToken ,UserController.handleRefreshToken)
router.get("/logout", verifyAccessToken, UserController.logout)

module.exports = router;
