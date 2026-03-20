const accountModel = require("../model/account.model");
const LedgerModel = require("../model/ledger.model");
const transactionModel = require("../model/transaction.model");
const mongo = require("mongoose");
const {
  sendTransactionEmail,
  sendFailTransactionEmail,
} = require("../services/email.services");

async function PerformTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message:
        "fromAccount OR toAccount OR amount OR idepotencyKey is Not Found",
    });
  }

  const TransactionAlreadyExits = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
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

  const fromUserAccount = await accountModel.findById(fromAccount);

  const toUserAccount = await accountModel.findById(toAccount);

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

  const [transaction] = await transactionModel.create(
    [
      {
        toAccount,
        fromAccount,
        status: "PENDING",
        amount,
        idempotencyKey,
      },
    ],
    { session },
  );

  const [debitLedgerEntery] = await LedgerModel.create(
    [
      {
        account: fromAccount,
        amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  const [creditLedgerEntery] = await LedgerModel.create(
    [
      {
        account: toAccount,
        amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
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

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount OR amount OR idempotencyKey Required",
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      message: "Amount must be greater than 0",
    });
  }

  const session = await mongo.startSession();

  try {
    session.startTransaction();

    // 🔹 Idempotency check
    const existingTx = await transactionModel.findOne({
      idempotencyKey,
    });

    if (existingTx) {
      return res.status(200).json({
        message: "Transaction already processed",
        transaction: existingTx,
      });
    }

    const toUserAccount = await accountModel.findById({ _id: toAccount });
    if (!toUserAccount) {
      throw new Error("Invalid Account");
    }

    const fromUserAccount = await accountModel.findOne({
      AccountId: req.user._id,
    });

    if (!fromUserAccount) {
      throw new Error("System User Account Not Found");
    }

    const transaction = new transactionModel({
      fromAccount: fromUserAccount._id,
      toAccount,
      status: "PENDING",
      amount,
      idempotencyKey,
    });

    // 🔹 CREDIT (toAccount)
    await LedgerModel.create(
      [
        {
          account: toAccount,
          amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    // 🔹 DEBIT (fromUserAccount) ✅ FIXED
    await LedgerModel.create(
      [
        {
          account: fromUserAccount._id,
          amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session },
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Initial funds transaction successfully completed",
      transaction: transaction[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    return res.status(400).json({
      message: err.message || "Transaction failed",
    });
  }
}

module.exports = {
  createInitialFundsTransaction,
  PerformTransaction,
};
