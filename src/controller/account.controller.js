const AccountModel = require('../model/account.model')

async function CreateAccount(req,res){
  
   const user = req.user

   const account = await AccountModel.create({
       AccountId : user._id
   })


   res.status(201).json({
      message : "Account",
      account
   })



}



module.exports=CreateAccount