var mongoose=require("mongoose");
var Schema= mongoose.Schema;

var articleSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    author:String,
    likes:{
        type:Number,
        default:0
    },
    tags:[String],
    content:String,
    comments:[{
        type:Schema.Types.ObjectId,
        ref:"Comment",
    }],
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    media:String
},{timestamps:true})

module.exports= mongoose.model("Article",articleSchema)