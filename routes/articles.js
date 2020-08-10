var express = require("express");
var router = express.Router();
var Article = require("../models/article");
var Comment = require("../models/comment");
var flash = require("connect-flash");
var multer = require("multer");
var path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

/* GET users listing. */

//list of articles
router.get("/", (req, res, next) => {
  Article.find({})
    .sort({ updatedAt: -1 })
    .exec((err, articles) => {
      if (err) return next(err);
      var msg = req.flash("msg");
      return res.render("home", { articles, msg });
    });
});

//pipe to limit
// router.get("/", (req, res, next) => {
//   Article.find({}).limit(1).skip(1).exec((err, articles) => {
//     if (err) return next(err);
//     res.render("home", { articles });
//   });
// });

// new article create
router.get("/new", (req, res, next) => {
  // console.log(req.session ,"session is here")
  res.render("new");
});

//post new article
router.post("/new", upload.single("media"), (req, res, next) => {
  req.body.tags = req.body.tags.split(",");
  req.body.userId = req.session.userId;
  req.body.author = res.locals.userInfo.name;
  // req.body.media=req.file.filename;
  console.log(req.body);

  Article.create(req.body, (err, data) => {
    if (err) return next(err);
    req.flash("msg", "Article Created Successfully");
    res.redirect("/articles");
  });
});

//get my all articles

router.get("/myarticles", (req, res, next) => {
  Article.find({ userId: req.session.userId })
    .sort({ updatedAt: -1 })
    .exec((err, articles) => {
      if (err) return next(err);
      res.render("myarticles", { articles });
    });
});

// single article details

router.get("/:articleId", (req, res, next) => {
  let articleId = req.params.articleId;
  Article.findById(articleId)
    .populate({ path: "comments", options: { sort: { updatedAt: -1 } } })
    .exec((err, articles) => {
      if (err) return next(err);
      var msg = req.flash("msg");
      res.render("singleArticle", { articles, msg });
    });
});

//edit single article

router.get("/:articleId/edit", (req, res, next) => {
  let articleId = req.params.articleId;
  Article.findById(articleId, (err, articles) => {
    if (articles.userId == req.session.userId) {
      if (err) return next(err);
      res.render("edit", { articles });
    } else {
      res.redirect(`/articles/${articleId}`);
    }
  });
});

//post edit article
router.post("/:articleId/edit", (req, res, next) => {
  let articleId = req.params.articleId;
  Article.findByIdAndUpdate(
    articleId,
    req.body,
    { new: true },
    (err, articles) => {
      if (err) return next(err);
      req.flash("msg", "Article Updated Successfully");
      res.redirect(`/articles/${articleId}`);
    }
  );
});

//like method
router.get("/:articleId/like", (req, res, next) => {
  let articleId = req.params.articleId;
  Article.findByIdAndUpdate(
    articleId,
    { $inc: { likes: 1 } },
    { new: true },
    (err, articles) => {
      if (err) return next(err);
      res.redirect(`/articles/${articleId}`);
    }
  );
});

//delete article
router.get("/:articleId/delete", (req, res, next) => {
  articleId = req.params.articleId;
  Article.findById(articleId, (err, article) => {
    if (err) return next(err);
    if (article.userId == req.session.userId) {
      Article.findByIdAndRemove(articleId, (err, Deletedarticle) => {
        if (err) return next(err);
        req.flash("msg", "Article Deleted SuccessFully");
        res.redirect("/articles");
      });
    } else {
      res.redirect(`/articles/${articleId}`);
    }
  });
});

// comment router handle
router.post("/:articleId", (req, res, next) => {
  var articleId = req.params.articleId;
  req.body.articleId = req.params.articleId;
  req.body.author = res.locals.userInfo.name;
  req.body.userId = req.session.userId;
  Comment.create(req.body, (err, newcomment) => {
    if (err) return next(err);
    console.log(newcomment, "comemnt");
    Article.findByIdAndUpdate(
      articleId,
      { $push: { comments: newcomment.id } },
      (err, article) => {
        if (err) return next(err);
        res.redirect(`/articles/${articleId}`);
      }
    );
  });
});

module.exports = router;
