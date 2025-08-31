const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://yashkumar:<password>@taskmaneger.uxn1lc8y.mongodb.net/taskmanager?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(" MongoDB Atlas Connected"))
.catch(err => console.error(" MongoDB Connection Error:", err));

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