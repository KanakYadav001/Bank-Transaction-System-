const mongoose = require('mongoose')

async function ConnectToDB(){
    try{
    await mongoose.connect(process.env.MONGO_URL)
    console.log("DB Connected Sucessfully")
    }catch(err){
        console.log("DB Not Connected !!!",err )
    }
}


module.exports=ConnectToDB