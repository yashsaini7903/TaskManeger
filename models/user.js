const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    username:String,
    name:String,
    age:Number,
    email:String,
    password:String,
    tasks:[
         {type:mongoose.Schema.Types.ObjectId,ref:"task"}
    ]
});


module.exports= mongoose.model('user',userSchema);


