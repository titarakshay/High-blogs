var monggoose=require('mongoose');
var Schema=monggoose.Schema;
var bcrypt=require('bcrypt');

var userSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    googleId:String,
    githubId:String

},{timestamps:true})

userSchema.pre('save',function(next){
    if(this.password && this.isModified('password')){
        bcrypt.hash(this.password,10,(err,hashPassword)=>{
            if(err) return next(err);
            this.password=hashPassword;
            console.log(this.password,"hash ganja");
            return next();
        })
    }else{
        return next();
    }
})
userSchema.methods.verify= function(password){
   return  bcrypt.compareSync(password,this.password)
}


module.exports=monggoose.model('User',userSchema)