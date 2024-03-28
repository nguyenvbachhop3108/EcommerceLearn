const asyncHandler = require("express-async-handler");
const { user } = require("../models/user.model");
const { createPairToken } = require("../middlewares/signTokens");
const { trusted } = require("mongoose");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      success: false,
      mes: "Missing Input",
    });
  }

  const foundUser = await user.findOne({ email });
  if (foundUser) throw new Error("User has existed!");
  else {
    const newUser = await user.create(req.body);
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

  const response = await user.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    const { password, roles, ...metadata } = response.toObject();
    const tokens = await createPairToken({ userId: response._id, roles });
    const { refreshToken } = tokens;
    await user.findOne(response._id, { refreshToken }, { new: true });
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
  const foundUser = await user.findById(_id);
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
  };;
  const newRefreshToken = await createPairToken(payload);

  await user.updateOne({
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
  await user.findOneAndUpdate(
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

module.exports = { register, login, getCurrent, handleRefreshToken, logout };
