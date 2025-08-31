const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://yashkumar:<db_password>@taskmaneger.uxn1c8y.mongodb.net/?retryWrites=true&w=majority&appName=TaskManeger"}

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
