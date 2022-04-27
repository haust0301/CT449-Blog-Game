const matchingPasswords = (req, res, next) => {
  if (req.body.password != req.body.confirmPassword) {
    return res.status(400).json({
      msg: "Passwords don't match.",
    });
  }
  next();
};

module.exports = {
  matchingPasswords,
};
