const mongoose = require("mongoose");
const Joi = require("joi");
const bCrypt = require("bcrypt");
const gravatar = require("gravatar");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    // required: [true, "Verify token is required"],
  },
  avatarURL: String,
  token: String,
});

userSchema.methods.setPassword = function (password) {
  this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

userSchema.methods.validPassword = function (password) {
  return bCrypt.compareSync(password, this.password);
};

userSchema.methods.setAvatar = function (email) {
  this.avatarURL = gravatar.url(email);
};

userSchema.methods.setVerifyToken = function () {
  this.verificationToken = uuidv4();
  return this.verificationToken;
};

const validateUser = (user) => {
  const schema = Joi.object({
    email: Joi.string()
      .pattern(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/)
      .required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().messages({
      "string.base": `"subscription" should be a type of 'text'`,
      "string.empty": `"subscription" cannot be an empty field`,
      "any.required": `"subscription" is a required field`,
    }),
    verify: Joi.bool(),
    verificationToken: Joi.string(),
    avatarURL: Joi.string(),
    token: Joi.string(),
  });
  return schema.validate(user);
};

const User = new mongoose.model("user", userSchema);

module.exports = { User, validateUser };
