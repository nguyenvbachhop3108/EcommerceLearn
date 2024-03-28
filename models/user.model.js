"use strict"

const { model, Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const DOCUMANT_NAME = "User"
const COLLECTION_NAME = "Users"

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: String,
      required: true,
      default: "user",
    },
    cart: {
      type: Array,
      default: [],
    },
    address: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: String, 
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  const salt = bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = { user: model(DOCUMANT_NAME, userSchema) };
