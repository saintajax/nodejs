const User = require("./schemas/users");

const registration = async (email, password) => {
  const user = new User({ email, password });
  console.log(user.methods.setPassword);
  //   await user.save();
};

const login = () => {};

module.exports = { registration, login };
