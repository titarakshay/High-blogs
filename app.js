var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var flash = require("connect-flash");
var passport = require("passport");
var multer = require("multer");

//dot env
require("dotenv").config();

//require passport
require("./modules/passport");

//database connection
mongoose.connect(
  "mongodb://localhost/test",
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  (err) => {
    console.log("connected", err ? err : true);
  }
);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var articleRouter = require("./routes/articles");
var commentRouter = require("./routes/comment");
var auth = require("./middlewares/auth");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// session create
app.use(
  session({
    secret: "keyboard cat",
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: true,
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//cookie  count or set cokkie
app.use((req, res, next) => {
  //  res.cookie("count" ,1);
  if (req.cookies.count) {
    var num = Number(req.cookies.count);
    res.cookie("count", num + 1);
  } else {
    res.cookie("count", 1);
  }
  next();
});

app.use(flash());
// router handle

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use(auth.userInfo);
app.use("/articles", auth.logged, articleRouter);
app.use("/comments", auth.logged, commentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err, "err is here");
  if (err.name == "MongoError") {
    req.flash("Error", "Email is already Exist");
    res.redirect("/users/register");
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
