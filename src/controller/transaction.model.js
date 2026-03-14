const accountModel = require("../model/account.model");
const LedgerModel = require("../model/ledger.model");
const transactionModel = require("../model/transaction.model");
const mongo = require('mongoose')




async function PerformTransaction(req, res) {
  const { fromAccount, toAccount, amount, idepotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idepotencyKey) {
    return res.status(401).json({
      message:
        "fromAccount OR toAccount OR amount OR idepotencyKey is Not Found",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(201).json({
      message: "FromAccount and ToAccount Not Found",
    });
  }

  const TransactionAlreadyExits = await transactionModel.findOne({
    idepotencyKey: idepotencyKey,
  });

  if (TransactionAlreadyExits) {
    if (TransactionAlreadyExits.status === "COMPLETED") {
      res.status(200).json({
        message: "Transaction Fail Sucessfully Completed",
        transaction: TransactionAlreadyExits,
      });
    }
    if (TransactionAlreadyExits.status === "PENDING") {
      res.status(200).json({
        message: "Transaction Still In Panding Please Wait",
      });
    }
    if (TransactionAlreadyExits.status === "REVERSE") {
      res.status(500).json({
        message: "Transaction was REVERSED please Retry again",
      });
    }
    if (TransactionAlreadyExits.status === "FAIL") {
      res.status(500).json({
        message: "Transaction Fail Please Retry",
      });
    }
  }

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(500).json({
      message: "Account Not Active Transaction Fail",
    });
  }
  
  const Balance  = await fromUserAccount.getBalance()

  if(Balance < amount){
 return res.status(400).json({
    message : `Insufficient Balance in Your Current Balance is ${Balance}`
   })
  }


  const session  = await mongo.startSession()
  session.startTransaction()

  const transaction = await transactionModel.create({
    toAccount,
    fromAccount,
    status : "PENDING",
    amount,
    idepotencyKey
  }, {session})


  const debitLedgerEntery = await LedgerModel.create({
    account : fromAccount,
    amount,
    transaction : transaction._id,
    type : "DEBIT"
  }, {session})

const creditLedgerEntery = await LedgerModel.create({
    account : toAccount,
    amount,
    transaction : transaction._id,
    type : "CREDIT"
  }, {session})

  transaction.status = "COMPLETED"
  await transaction.save({session})


  await session.commitTransaction()
  session.endSession()

}

module.exports = PerformTransaction;
