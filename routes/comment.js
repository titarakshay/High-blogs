var express= require("express");
var router=express.Router();
var Article=require("../models/article");
var Comment=require("../models/comment");


//*comment edit handler */

//update comment get
router.get("/:commentId/edit", (req, res, next) => {
    var commentId = req.params.commentId;
    Comment.findById(commentId, (err, comment) => {
      if(comment.userId == req.session.userId){
        if (err) return next(err);
        res.render("editComment", { comment});
      }else{
        res.redirect(`/articles/${comment.articleId}`)
      }
      });
  });
  
  
  //update comment post
  router.post("/:commentId", (req, res, next) => {
    var commentId = req.params.commentId;
  
    Comment.findByIdAndUpdate(
      commentId,
      req.body,
      { new: true },
      (err, comment) => {
        if (err) return next(err);
        res.redirect(`/articles/${comment.articleId}`);
      }
    );
  });

 // delete comment
  router.get("/:commentId/delete", (req, res, next) => {
    var commentId = req.params.commentId;
    Comment.findByIdAndDelete(commentId, (err,comment) => {
      if(comment.userId == req.session.userId){
        if (err) return next(err);
        Article.findByIdAndUpdate(
          comment.articleId,
          { $pull: { comments: commentId } },
          (err, article) => {
            if (err) return next(err);
            res.redirect(`/articles/${comment.articleId}`);
          }
          );
        }else{
          res.redirect(`/articles/${comment.articleId}`)
        }
    });
  });

  router.get("/:commentsId/like", (req, res, next) => {
    let articleId = req.params.articleId;
    var commentId = req.params.commentsId;
    Comment.findByIdAndUpdate(
      commentId,
      { $inc: { likes: 1 } },
      { new: true },
      (err, comments) => {
        if (err) return next(err);
        console.log(comments ,"comments ");
        res.redirect(`/articles/${comments.articleId}`);
      }
    );
  });

  module.exports=router;