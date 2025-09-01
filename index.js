const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken'); 
const bcrpt = require('bcrypt');
const userModel =  require('./models/user');
const taskModel = require('./models/task');
let mongoose=require("mongoose")
//  mongoose.connect("mongodb+srv://ysaini9466_db_user:LCOnVVGAAmwxwToH@cluster0.rkstdwn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
mongoose.connect("mongodb+srv://nodeuser:Yahoo123@cluster0.ag3fwai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  tls: true,
  tlsAllowInvalidCertificates: true
});
   

 let db=mongoose.connection;
db.once("open",()=>{
    console.log("database connected succesfully")
})
db.on("error",()=>{
    console.log("error appeared");
})

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
;


app.get('/',(req,res)=>{
    res.render("singup");
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/profile',isLoggedIn,async(req,res)=>{
    let user = await userModel.findOne({email:req.user.email}).populate("tasks");
    res.render('profile',{user:user});
})

app.post('/register',async(req,res)=>{
    let {username,email, name ,password,age}=req.body;
    let user = await userModel.findOne({email});
    if(user) return res.status(500).send('user already exist');

    bcrpt.genSalt(10,(err,salt)=>{
        bcrpt.hash(password ,salt,async(err,hash)=>{
         let user= await userModel.create({
                username,
                email,
                age,
                name,
                password:hash
            });
            let token = jwt.sign({email:email,userid: user._id},"shhhhh");
            res.cookie("token",token);
            res.redirect("/profile");
        })
    })     
});

app.post('/login',async(req,res)=>{
    let {email ,password}=req.body;
    let user = await userModel.findOne({email});
    if(!user) return res.status(500).send('Somthing went worng');

    bcrpt.compare(password,user.password,(err,result)=>{
        if(result) { 
            
            let token = jwt.sign({email:email,userid: user._id},"shhhhh");
            res.cookie("token",token);
            res.status(200).redirect('/profile');
        }
        else res.redirect('/login');
    })
})

app.post('/task',isLoggedIn,async(req,res)=>{
    let user = await userModel.findOne({email:req.user.email});
    let{title,notes}=req.body;
    let task =  await taskModel.create({
        user:user._id,
        title,
        notes
    });
    user.tasks.push(task._id);
    await user.save();
    res.redirect('/profile');
})

app.get('/logout',async(req,res)=>{
    res.clearCookie("token");
    res.redirect('/login');
});

app.get('/edit/:id',async(req,res)=>{
    let task = await taskModel.findById(req.params.id);
    res.render('edit',{task});
})

app.get('/delete/:id',isLoggedIn,async(req,res)=>{
    let task = await taskModel.findOneAndDelete({_id:req.params.id});
    await userModel.findByIdAndUpdate(req.user.userid, { $pull: { tasks: req.params._id } });
    res.redirect('/profile');
})

app.post('/edit/:id',async(req,res)=>{
    let task = await taskModel.findOneAndUpdate({_id:req.params.id},{
        title:req.body.title,
        notes:req.body.notes,
        status: req.body.status
    })
    res.redirect('/profile');
})

// Toggle Task Status
app.post('/task/toggle/:id', async (req, res) => {
  try {
    const task = await taskModel.findById(req.params.id);
    if (!task) return res.redirect('/profile');

    task.status = task.status === 'completed' ? 'pending' : 'completed';
    await task.save();

    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.redirect('/profile');
  }
});


function isLoggedIn(req,res,next){
    if(req.cookies.token=="") res.send("You must be logged in");
    else{
        let data = jwt.verify(req.cookies.token,"shhhhh");
        req.user=data;
    }
    next();
}

app.listen(3000,()=>{
    console.log("server started succesfully");
});
