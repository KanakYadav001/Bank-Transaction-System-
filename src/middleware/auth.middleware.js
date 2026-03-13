const jwt = require('jsonwebtoken')
const UserModel = require('../model/user.model')



async function AuthMiddlwware(req,res,next){

    const token = req.cookies.token || req.header.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message : "Token Not Found Please Login Or Register First"
        })
    }

    try{

   const decoaded = jwt.verify(token,process.env.JWT_SECRET)

   const user = await UserModel.findById(decoaded.id)

  req.user = user
  next()

    }catch(err){
  
        res.status(401).json({
            message:"Unauthorized Invalid Token !!"
        })
    }
}


module.exports=AuthMiddlwware