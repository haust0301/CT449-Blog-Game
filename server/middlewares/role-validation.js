const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: "Can't validate role if token is not validated.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `Insufficient privileges.`,
      });
    }
    next();
  };
};

module.exports = {
  hasRole,
};
