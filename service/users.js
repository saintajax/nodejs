const { User } = require("./schemas/users");

const findUser = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const saveUser = async (user) => {
  await user.save();
};

const registrationConfirmation = async (verificationToken) => {
  const user = await User.findOneAndUpdate(
    { verificationToken },
    {
      verificationToken: null,
      verify: true,
    }
  );
  return user;
};

module.exports = { findUser, saveUser, registrationConfirmation };
