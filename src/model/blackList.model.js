
const mongo  = require("mongoose");

const BlackListSchema = new mongo.Schema({
  
    token : {
        type : String,
        required : [true,"Token is Required to add in BlackList"],
        unique : [true,"Token Must be Unique for BlackList"],
    }
},{timestamps : true});

BlackListSchema.index({createdAt : 1},{
    expireAfterSeconds : 60*60*24*3, // 3 days
})


const BlackListModel = mongo.model("blacklist",BlackListSchema);

module.exports = BlackListModel;