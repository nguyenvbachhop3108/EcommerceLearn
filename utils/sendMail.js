const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

const sendMail = asyncHandler(async (email, html) => {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Cửa hàng điện tử 👻" <no-reply@cuahangdientu.com>', // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Forgot password", // plain text body
    html: html, // html body
  });

  return info;
});

module.exports = { sendMail };
