const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs").promises;
const Jimp = require("jimp");
const { User } = require("../service/schemas/users");
require("dotenv").config();
const { SECRET_KEY } = process.env;

const storeImage = path.join(process.cwd(), "public/avatars");

const uploadController = async (req, res, next) => {
  const { authorization } = req.headers;
  const [_, token] = authorization.split(" ");
  const { path: temporaryName, filename } = req.file;
  const fileName = path.join(storeImage, filename);
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
    Jimp.read(temporaryName, (err, avatar) => {
      if (err) throw err;
      avatar.resize(250, 250).quality(60).write(fileName);
    });
    await User.findByIdAndUpdate(id, { avatarURL: fileName });
    await fs.rename(temporaryName, fileName);
    return res.status(200).json({
      status: "Ok",
      code: 200,
      data: {
        avatarURL: `${fileName}`,
      },
    });
  } catch (error) {
    await fs.unlink(temporaryName);
    return next(error);
  }
};

module.exports = {
  uploadController,
};
