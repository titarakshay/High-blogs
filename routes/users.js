var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Article = require("../models/article");
var Comment = require("../models/comment");
var flash = require("connect-flash");

/* GET users listing. */
router.get("/login", function (req, res, next) {
  var msg = req.flash("Error");
  res.render("login", { msg });
});
router.post("/login", function (req, res, next) {
  var { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash("Error", "Wrong Username");
      return res.redirect("/users/login");
    }
    if (!user.verify(password)) {
      req.flash("Error", "Wrong Password");
      return res.redirect("/users/login");
    }
    req.session.userId = user.id;
    req.flash("msg", "Welcome To High");
    res.redirect("/articles");
  });
});

router.get("/register", (req, res, next) => {
  var msg = req.flash("Error");
  console.log(msg);
  res.render("register", { msg });
});

router.post("/register", (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    res.redirect("/users/login");
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  console.log("destroy session");
  res.redirect("/users/login");
});


module.exports = router;
