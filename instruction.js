// instruction for comments

import { request } from "express"


// commentRouter declare in app.js

// handle all edit delete router in that commentRouter



// get method on ("/:commentId/edit")
// edit Comment,
//  post method on this page with updated data,
// post method  Comment.findbyId and update(err,comment)

// we get articleId in comment body
//  redirect to single article page with( `/articles/${comment.articleId}`)


// delete method

//  get request on("/comments/:commentId/delete")
//     delete comment and redirec to singlearticlepage

// Comment.findByIdAndDelete(id,(err,doc)=>{
//     if(err);
    // Article.findByIdAndUpdate(doc.articleId,($pull : {comments:doc.id});

  
//     res.redirect(`/articles/${doc.articleId}`)
// })


// pipe method 
// pipe multiple queries
// limit(10) to articles shwo pages
// skip (5) skip 1st 5 and show
//after all queries exec() method used