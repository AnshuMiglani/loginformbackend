const express= require("express");
const mongoose= require("mongoose");
const validator= require("validator");
const bcrypt= require("bcryptjs");
const jwt= require("jsonwebtoken");

const memberschema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not a valid email");
            }
        }
    },
    Gender: {
        type: String,
        required: true
    },
    Phone: {
        type: Number,
        required: true,
        unique: true,
        minlength: 10,
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [
        {
       token: {
        type: String,
        required: true
        }
    }
    ]
});

memberschema.methods.jsonwebtokenkaam=  async function (){
    try{
        const data= jwt.sign({_id: this._id},process.env.SECRET_KEY,{expiresIn: "15m"});
        // console.log(data);
        this.tokens= this.tokens.concat({token:data});
        await this.save();
        return data;

    }catch(e){
        console.log(e);
        // res.send(e);
    }
    
};

memberschema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password= await bcrypt.hash(this.password,10);
    }
    next();
});

const member= new mongoose.model("form_content",memberschema);
module.exports= member;