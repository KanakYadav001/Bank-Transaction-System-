const mongo = require('mongoose')


const TransactionScema = new mongo.Schema({
  
    fromAccount : {
        type : mongo.Schema.Types.ObjectId,
        ref : "account",
        required : [true,"User Id Must Be Need for send  a transaction"],
        index : true
    },
    toAccount : {
        type : mongo.Schema.Types.ObjectId,
        ref : "account",
        required :[true,"User Id Must Be Need for receave  a transaction"],
        index : true
    },

    status: {
        type : String,
        enum :{
            values : ["SUCESSFULLY","PENDING","REVERSE","FAIL"],
           message : "Status Must be SUCESSFULLY ,PENDING,REVERSE and FAIL"
        },
        default : "PENDING",
    },
    amount : {
        type : Number,
        required : [true,"Some Ammount needed to perform a transaction"],
        min : [0,"ammount not be negative"]
    },
    idepotencyKey :{
        type : String,
        required  :[true ,"Idepodency Key is needed to perform a transactions"],
        index : true,
        unique : true
    }
},{
    timestamps : true
})


const TransactioModel = mongo.model("transactions",TransactionScema)


module.exports=TransactioModel