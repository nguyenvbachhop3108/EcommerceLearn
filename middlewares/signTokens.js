const jwt = require("jsonwebtoken");

const createPairToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "2 days",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7 days",
  });
  return { accessToken, refreshToken };
};

module.exports = { createPairToken };
