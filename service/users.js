const { User } = require("./schemas/users");

const findUser = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const saveUser = async (user) => {
  await user.save();
};

module.exports = { findUser, saveUser };
