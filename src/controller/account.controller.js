const AccountModel = require("../model/account.model");

async function CreateAccount(req, res) {
  const user = req.user;

  const account = await AccountModel.create({
    AccountId: user._id,
  });

  res.status(201).json({
    message: "Account",
    account,
  });
}

async function GetAccountController(req, res) {

  const account = await AccountModel.find({
    AccountId : req.user._id
  });

  res.status(201).json({
    message: "Account Details Fetch Sucessfully",
    account,
  });
}

async function GetAccountBalance(req,res){
  const {AccountId} = req.params

  const account = await AccountModel.findOne({
     _id :   AccountId,
     AccountId : req.user._id
        
  })

  if(!account){
   return res.status(404).json({
      message  : "User Not Found"
   })
  }

  const Balance = await account.getBalance()


  res.status(201).json({
   accountId : account.id,
   Balance  : Balance
  })
}



module.exports = { CreateAccount, GetAccountController,GetAccountBalance};
