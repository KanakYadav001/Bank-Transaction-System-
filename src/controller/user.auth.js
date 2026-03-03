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



    const hashPassword = await bcrypt.hash(password,10);


    const User = await UserModel.create({
        username,
        email,
        password : hashPassword
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



module.exports={
    RegisterController
}