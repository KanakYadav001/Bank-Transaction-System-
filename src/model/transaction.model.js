const mongo = require("mongoose");

const TransactionSchema = new mongo.Schema(
  {
    fromAccount: {
      type: mongo.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "User Id Must Be Need for send  a transaction"],
      index: true,
    },
    toAccount: {
      type: mongo.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "User Id Must Be Need for receave  a transaction"],
      index: true,
    },

    status: {
      type: String,
      enum: {
        values: ["COMPLETED", "PENDING", "REVERSE", "FAIL"],
        message: "Status Must be COMPLETED ,PENDING,REVERSE and FAIL",
      },
      default: "PENDING",
    },
    amount: {
      type: Number,
      required: [true, "Some Ammount needed to perform a transaction"],
      min: [0, "ammount not be negative"],
    },
    idempotencyKey: {
      type: String,
      required: [true, "Idepodency Key is needed to perform a transactions"],
      index: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const TransactionModel = mongo.model("transactions", TransactionSchema);

module.exports = TransactionModel;
