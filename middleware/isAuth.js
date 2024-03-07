const isAuth = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.status(400).json({ message: "have not been logged in yet" });
  } else {
    next();
  }
};

module.exports = isAuth;
