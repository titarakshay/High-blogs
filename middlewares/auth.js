var User = require("../models/user");
exports.logged = (req, res, next) => {
  if (req.session.userId || req.session.passport) {
    return next();
  } else {
    return res.redirect("/users/login");
  }
};

exports.userInfo = (req, res, next) => {
  if (req.session.passport) {
    req.session.userId = req.session.passport.user;

    User.findById(
      req.session.userId,
      { email: 1, name: 1, userId: 1 },
      (err, user) => {
        if (err) return next(err);
        req.user = user;
        res.locals.userInfo = user;

        next();
      }
    );
  } else if (req.session.userId) {
    User.findById(
      req.session.userId,
      { email: 1, name: 1, userId: 1 },
      (err, user) => {
        if (err) return next(err);
        req.user = user;
        res.locals.userInfo = user;

        next();
      }
    );
  } else {
    req.user = null;
    res.locals.user = null;
    next();
  }
};
