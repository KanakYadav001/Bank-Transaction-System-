const jwt = require('jsonwebtoken')
const UserModel = require('../model/user.model')



async function AuthMiddleware(req,res,next){

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

async function AuthSystemUser(req,res,next){
    const token  =  req.cookies.token || req.headers.authorization?.split(' ')[1]

   

    if(!token){
        return res.status(401).json({
            message : "Token Not Found Please Login OR Register"
        })
    }


    try {

     const decoded  = jwt.verify(token,process.env.JWT_SECRET)

    const user = await UserModel.findById(decoded.id)
 
    if(!user){
        return res.status(401).json({
            message : "Invalid User !! "
        })
    }
    req.user = user


  return  next()
    }catch(err){
       
        
        return res.status(401).json({
            message  : "Invalid Token!!"
        })
    }
}
module.exports={AuthMiddleware,AuthSystemUser}