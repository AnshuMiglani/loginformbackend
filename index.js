const express= require("express");
const app= express();
const port= process.env.PORT || 8000;
const hbs= require("hbs");
const path= require("path");
const Swal= require("sweetalert2");
require("./db/connection");
app.set("view engine","hbs");
const member= require("./models/formdata");
const bcrypt= require("bcryptjs");
const cookieParser = require("cookie-parser");

hbs.registerPartials(path.join(__dirname,"/partials"));
app.use(express.static(path.join(__dirname,"/views")));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.render("main");
});

app.get("/register",(req,res)=>{
    res.render("registeration");
});

app.get("/secret",(req,res)=>{
    const datacookie= req.cookie.jwt;
    res.send("namste");
    console.log(datacookie);
});

app.post("/register",async(req,res)=>{
    try{
        const namewa= req.body.Firstname+" "+req.body.Lastname;
        if(req.body.Password== req.body.ConfirmPassword){
            const newmember= new member({
                name: namewa,
                email: req.body.Email,
                Gender: req.body.gender,
                Phone: req.body.Phone,
                age: req.body.Age,
                password: req.body.Password
            });

            const abc= await newmember.jsonwebtokenkaam();

            res.cookie("jwt",abc,{
                httpOnly:true
            });

            const saved= await newmember.save();
            // console.log("abc");
            res.render("main");

        }
    }
    catch(e){
        res.status(400).send(e);
    }

});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.post("/login",async(req,res)=>{
try{
    const answer= await member.find({email: req.body.email});
    const abc= await answer.jsonwebtokenkaam();
    console.log(abc);
    const ismatch= await bcrypt.compare(req.body.password,answer[0].password);
    if(ismatch){
        res.render("main");
    }
    else{
        res.status(400).send("Invalid password");
    }
}
catch(e){
    res.status(400).send(e);
}

});
app.listen(port,()=>{
    console.log("listening to port no 8000");
});