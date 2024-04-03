const asyncHandler = require("express-async-handler");
const { User } = require("../models/user.model");
const { createPairToken } = require("../middlewares/signTokens");
const { sendMail } = require("../utils/sendMail");
const crypto = require("crypto");
const { toObjId } = require("../utils/index");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      success: false,
      mes: "Missing Input",
    });
  }

  const foundUser = await User.findOne({ email });
  if (foundUser) throw new Error("User has existed!");
  else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      message: newUser
        ? "Register is successfully. Please go login~"
        : "Something went wrong",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      mes: "Missing Input",
    });
  }

  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    const { password, roles, ...metadata } = response.toObject();
    const tokens = await createPairToken({ userId: response._id, roles });
    const { refreshToken } = tokens;
    await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      mes: "Login Successed!",
      metadata,
      tokens,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const _id = req.user.userId;
  const foundUser = await User.findById(_id);
  return res.status(200).json({
    success: true,
    metadata: foundUser ? foundUser : "User not found",
  });
});

const handleRefreshToken = asyncHandler(async (req, res) => {
  //lấy userId
  const userId = req.user.userId;
  //Lấy token từ cookies
  const cookie = req.cookies;
  //check xem có token hay không
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  //check xem token có khớp với đã lưu trong database
  const response = await user.findOne({
    _id: userId,
  });

  const payload = {
    _id: response._id,
    roles: response.roles,
  };
  const newRefreshToken = await createPairToken(payload);

  await User.updateOne({
    refreshToken: newRefreshToken.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newRefreshToken,
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refreshToken in cookies");
  //Xóa refresh token ở db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: " " },
    { new: true }
  );
  //Xóa refresh token ở cookies trình duyệt
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "Logout is successed!",
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  //Client gửi email
  // Server check email có hợp lệ hay không => gửi email + kèm theo link (reset password)
  //Client check email => click link
  //Client gửi api kèm token
  //Check token có giống với token mà server gửi mail hay không
  //Change password
  const { email } = req.query;
  if (!email) throw new Error("Missing email");
  const foundUser = await user.findOne({ email });
  if (!foundUser) throw new Error("User doesn't exists!");

  // Create a new instance of User model
  const userInstance = new User(foundUser);

  // Call the createPasswordChangedToken method on the user instance
  const resetToken = await userInstance.createPasswordChangedToken();

  // Save the user instance to update the passwordResetToken and passwordResetExpires fields
  await userInstance.save();

  const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.
  <a href=${process.env.URL_SERVER}/v1/api/user/reset-password/${resetToken}>Click here</a>`;

  const response = await sendMail(email, html);

  return res.status(200).json({
    success: true,
    response,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing inputs!");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token!");
  (user.password = password), (user.passwordResetToken = undefined);
  user.passwordChangeAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: user ? true : false,
    mes: user ? "Updated password" : "Something went wrong",
  });
});

const getAllUser = asyncHandler(async (req, res) => {
  const response = await User.find().select("-refreshToken -password -roles");
  return res.status(200).json({
    message: "Get All User Successed",
    metadata: response,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Missing Input");
  const response = await User.findByIdAndDelete(_id).select(
    "-refreshToken -password -roles"
  );
  return res.status(200).json({
    message: response ? true : false,
    metadata: response
      ? `user with email ${response.email} has been deleted`
      : "No User Delete",
  });
});

const updateUser = asyncHandler(async (req, res) => {
  const _id = req.user.userId;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing Input");
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -roles");
  return res.status(200).json({
    message: response ? true : false,
    metadata: response ? response : "Something went wrong",
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const _id = req.user.userId;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing Input");
  const response = await User.findByIdAndUpdate(
    _id,
    { $push: { address: req.body.address } },
    { new: true }
  ).select("-password -roles");
  return res.status(200).json({
    message: response ? true : false,
    metadata: response ? response : "Something went wrong",
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (Object.keys(req.body).length === 0) throw new Error("Missing Input");
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -roles");
  return res.status(200).json({
    message: response ? true : false,
    metadata: response ? response : "Something went wrong",
  });
});

const addToCart = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const { pId, quantity, color } = req.body;

  if (!pId || !quantity || !color) {
    throw new Error("Missing Input");
  }

  const userCart = await User.findById(userId).select("cart");
  const alreadyProductIndex = userCart.cart.findIndex(
    (el) => el.product.toString() === pId
  );

  if (alreadyProductIndex !== -1) {
    const alreadyProduct = userCart.cart[alreadyProductIndex];

    if (alreadyProduct.color === color) {
      userCart.cart[alreadyProductIndex].quantity = quantity;
    } else {
      userCart.cart.push({ product: pId, quantity, color });
    }
  } else {
    userCart.cart.push({ product: pId, quantity, color });
  }

  const response = await userCart.save();

  return res.status(200).json({
    message: response ? true : false,
    metadata: response ? response : "Something went wrong",
  });
});

module.exports = {
  register,
  login,
  getCurrent,
  handleRefreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getAllUser,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  addToCart,
};
