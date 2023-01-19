// const service = require("../service/users");
const jwt = require("jsonwebtoken");
const { User } = require("../service/schemas/users");
const { findUser, saveUser } = require("../service/users");
require("dotenv").config();
const { SECRET_KEY } = process.env;

const registrationController = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findUser(email);
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email in use",
      data: "Conflict",
    });
  }
  try {
    const newUser = new User({ email });
    newUser.setPassword(password);
    newUser.setAvatar(email);
    await saveUser(newUser);
    res.status(201).json({
      status: "Created",
      code: 201,
      data: {
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUser(email);
  if (!user || !user.validPassword(password)) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Email or password is wrong",
    });
  }

  const payload = {
    id: user.id,
  };

  const token = jwt.sign(payload, SECRET_KEY);
  user.token = token;
  await user.save();
  res.json({
    status: "Ok",
    code: 200,
    data: {
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    },
  });
};

const logoutController = async (req, res, next) => {
  const { authorization } = req.headers;
  const [_, token] = authorization.split(" ");
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (user.token !== token || user.token === "") {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Not authorized",
      });
    }
    user.token = "";
    await user.save();
    return res.status(204);
  } catch (error) {
    next(error);
  }
};

const getCurrentController = async (req, res, next) => {
  const { authorization } = req.headers;
  const [_, token] = authorization.split(" ");
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (user.token !== token || user.token === "") {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Not authorized",
      });
    }
    return res.status(200).json({
      status: "Ok",
      code: 200,
      message: "Sended",
      data: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registrationController,
  loginController,
  logoutController,
  getCurrentController,
};
