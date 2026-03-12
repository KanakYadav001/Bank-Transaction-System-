const mongo = require('mongoose')


const AcountScema = new mongo.Schema({
 
    AccountId :{
         type : mongo.Schema.Types.ObjectId,
         ref : "user",
         required : [true,"Account Must Be Relate With User"],
         index : true

    },

    status :{
        enum : {
         values: ["ACTIVE","FROZEN","DELEATED"],
        message : "Accoumt eather active,frozen and deleated"
        }
       
    },
    currency : {
        type : String,
        required :[true,"Currency is Required to creating a account"],
        default : "INR"
    }
},{
    timestamps : true
})

AcountScema.index({index : 1 , status :1})


const AccountModel = mongo.model("account",AcountScema)



module.exports=AccountModel