const asyncHandler = require("express-async-handler");
const { user } = require("../models/user.model");
const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      success: false,
      mes: "Missing Input",
    });
  }
  const response = await user.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    response,
  });
});

module.exports = { register };
