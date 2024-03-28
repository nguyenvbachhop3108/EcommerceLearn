const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
      if (error) {
        console.error(`Access Token Verification Error:`, error);
      } else {
        console.log(`Access Token Decoded:`, decode);
        req.user = decode;
        next();
      }
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Require authentication",
    });
  }
});

module.exports = { verifyAccessToken };
