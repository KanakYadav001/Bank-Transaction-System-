const accountModel = require("../model/account.model");
const LedgerModel = require("../model/ledger.model");
const transactionModel = require("../model/transaction.model");
const mongo = require("mongoose");
const { sendTransactionEmail } = require("../services/email.services");

async function PerformTransaction(req, res) {
  const { fromAccount, toAccount, amount, idepotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idepotencyKey) {
    return res.status(400).json({
      message:
        "fromAccount OR toAccount OR amount OR idepotencyKey is Not Found",
    });
  }

  const TransactionAlreadyExits = await transactionModel.findOne({
    idepotencyKey: idepotencyKey,
  });

  if (TransactionAlreadyExits) {
    if (TransactionAlreadyExits.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction Fail Sucessfully Completed",
        transaction: TransactionAlreadyExits,
      });
    }
    if (TransactionAlreadyExits.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction Still In Panding Please Wait",
      });
    }
    if (TransactionAlreadyExits.status === "REVERSE") {
      return res.status(400).json({
        message: "Transaction was REVERSED please Retry again",
      });
    }
    if (TransactionAlreadyExits.status === "FAIL") {
      return res.status(400).json({
        message: "Transaction Fail Please Retry",
      });
    }
  }

  const fromUserAccount = await accountModel.findById(
     fromAccount
  );

  const toUserAccount = await accountModel.findById(
     toAccount
  );

  if (!fromUserAccount || !toUserAccount) {
    return res.status(404).json({
      message: "FromAccount and ToAccount Not Found",
    });
  }

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message: "Account Not Active Transaction Fail",
    });
  }

  const Balance = await fromUserAccount.getBalance();

  if (Balance < amount) {
    return res.status(400).json({
      message: `Insufficient Balance in Your Current Balance is ${Balance}`,
    });
  }

  const session = await mongo.startSession();
  session.startTransaction();

  const transaction = await transactionModel.create(
    {
      toAccount,
      fromAccount,
      status: "PENDING",
      amount,
      idepotencyKey,
    },
    { session },
  );

  const debitLedgerEntery = await LedgerModel.create(
    {
      account: fromAccount,
      amount,
      transaction: transaction._id,
      type: "DEBIT",
    },
    { session },
  );

  const creditLedgerEntery = await LedgerModel.create(
    {
      account: toAccount,
      amount,
      transaction: transaction._id,
      type: "CREDIT",
    },
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  await sendTransactionEmail(req.user.email, req.user.name, amount, toAccount);

  res.status(201).json({
    message: "Transaction Complete Sucessfully",
    transaction: transaction,
  });
}

module.exports = PerformTransaction;
