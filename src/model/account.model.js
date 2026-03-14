const mongo = require("mongoose");
const ledgerModel = require("./ledger.model");

const AcountScema = new mongo.Schema(
  {
    AccountId: {
      type: mongo.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Account Must Be Relate With User"],
      index: true,
    },

    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "FROZEN", "DELEATED"],
        message: "Accoumt eather active,frozen and deleated",
      },
      default: "ACTIVE",
    },
    currency: {
      type: String,
      required: [true, "Currency is Required to creating a account"],
      default: "INR",
    },
  },
  {
    timestamps: true,
  },
);

AcountScema.index({ index: 1, status: 1 });
AcountScema.methods.getBalance = async function () {
  const balanceData = await ledgerModel.aggregate([
    { $match: { account: this._id } },
    {
      $group: {
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
          },
        },
        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        balance: { $subtract: ["$totalCredit","$totalDebit"] },
      },
    },
  ]);
  if(balanceData.length === 0){
    return 0
  }

  return balanceData[0].balance
};

const AccountModel = mongo.model("account", AcountScema);

module.exports = AccountModel;
