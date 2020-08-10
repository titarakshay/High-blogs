var mongoose=require("mongoose")
var Schema=mongoose.Schema;

var commentSchema= new Schema({
    content:{
        type:String,
        required:true
    },
    articleId:{
        type: Schema.Types.ObjectId,
        ref:"Article",
        required:true
    },
    author:String,
    likes:{
        type:Number,
        default:0
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

module.exports=mongoose.model("Comment",commentSchema)