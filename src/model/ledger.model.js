const mongo = require("mongoose");

const LedgerSchema = new mongo.Schema({
  account: {
    type: mongo.Schema.Types.ObjectId,
    ref: "account",
    required: [true, "This is Need For Make A Ledger"],
    index: true,
    immutable: true,
  },
  amount: {
    type: Number,
    required: [true, "Ammount is Need For Make A  ledger entry"],
    immutable: true,
  },
  transaction: {
    type: mongo.Schema.Types.ObjectId,
    required: [true, "This is Need For Make A  transaction ledger"],
    immutable: true,
    index: true,
  },
  type: {
    type: String,
    enum: {
      values: ["CREDIT", "DEBIT"],
      message: "Types Only in CREDIT OR DEBIT",
    },
    immutable: true,
    required: [true, "ledger type is require"],
  },
});


function PreventLegderInfo(){
    throw new Error('Step Back You Cannot Modify Ledger Entries ')
    
}

LedgerSchema.pre('findOneAndDelete',PreventLegderInfo)
LedgerSchema.pre('findOneAndReplace',PreventLegderInfo)
LedgerSchema.pre('findOneAndUpdate',PreventLegderInfo)
LedgerSchema.pre('remove',PreventLegderInfo)
LedgerSchema.pre('deleteOne',PreventLegderInfo)
LedgerSchema.pre('deleteMany',PreventLegderInfo)
LedgerSchema.pre('updateMany',PreventLegderInfo)
LedgerSchema.pre('updateOne',PreventLegderInfo)



const LedgerModel = mongo.model("ledger",LedgerSchema)



module.exports=LedgerModel
