const jwt = require('jsonwebtoken')
const UserModel = require('../model/user.model')
const bcrypt = require('bcryptjs')

async function RegisterController(req,res){
 
    const {username , email , password} = req.body


    const IsUser = await UserModel.findOne({
        email
    })

    if(IsUser){
        return res.status(422).json({
        message : "User Already Exits",
        status : "Email Already Exits"
        })    
    }



    


    const User = await UserModel.create({
        username,
        email,
        password
    })


    const token  = jwt.sign({id : User._id},process.env.JWT_SECRET,{expiresIn: "1h"})


    res.cookie('token',token)


    res.status(201).json({
       message : "User Create Sucessfully",
       user : {
        id : User._id,
        password : User.password,
        email : User.email
       }

       
    })



}


async function LoginController(req,res){

   const {email,password} = req.body
 

   const IsUser = await UserModel.findOne({email}).select('password')

   if(!IsUser){
    return res.status(401).json({
        message : "Invalid User Please Register First"
    })
   }

   const IsPassword = await IsUser.comparePassword(password)

   if(!IsPassword){
    return res.status(201).json({
        message  : "Invalid Password"
    })
   }

     const token  = jwt.sign({id : IsUser._id},process.env.JWT_SECRET,{expiresIn: "1h"})


    res.cookie('token',token)


    res.status(200).json({
       message : "User Login Sucessfully",
       user : {
        id : IsUser._id,
        password :IsUser.password,
        email : IsUser.email
       }

       
    })

}


module.exports={
    RegisterController,
    LoginController
}