module.exports = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    console.log("error: ", error);
    if (error) {
      return res.status(400).json({
        status: "Bad Request",
        code: 400,
        message: error.details[0].message,
        data: error.details[0].message,
      });
    }
    next();
  };
};
