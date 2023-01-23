const jwt = require("jsonwebtoken");
const { User } = require("../service/schemas/users");
const sendEmail = require("../helpers/sendEmail");
const {
  findUser,
  saveUser,
  registrationConfirmation,
} = require("../service/users");
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
    const verifyToken = newUser.setVerifyToken();
    await saveUser(newUser);
    const msg = {
      to: email,
      subject: "Thank for registration",
      text: `Please confirm your email. Send GET request to http://localhost:3000/api/auth/verify/${verifyToken}`,
      html: `<a target="_blank" href="http://localhost:3000/api/auth/verify/${verifyToken}">Please confirm your email</a>`,
    };
    await sendEmail(msg);

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

const registrationConfirmationController = async (req, res, next) => {
  const virifyToken = req.params.verificationToken;
  const user = await registrationConfirmation(virifyToken);
  if (!user) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "User not found",
    });
  }
  res.status(200).json({
    status: "Ok",
    code: 200,
    message: "Verification successful",
  });
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

  if (!user.verify) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Confirm your email",
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

const resendEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      status: "Bad request",
      code: 400,
      message: "missing required field email",
    });
  }
  try {
    const user = await findUser(email);
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Email is wrong",
      });
    }

    if (user.verify) {
      res.status(400).json({
        status: "Bad Request",
        code: 400,
        message: "Verification has already been passed",
      });
    }

    const verifyToken = user.setVerifyToken();

    const mail = {
      to: email,
      subject: "Verify email",
      text: `Please confirm your email. Send GET request to http://localhost:3000/api/auth/verify/${verifyToken}`,
      html: `<a target="_blank" href="http://localhost:3000/api/auth/verify/${verifyToken}">Please confirm your email</a>`,
    };

    await sendEmail(mail);

    res.status(200).json({
      status: "Ok",
      code: 200,
      message: "Verification email sent",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registrationController,
  registrationConfirmationController,
  loginController,
  logoutController,
  getCurrentController,
  resendEmail,
};
