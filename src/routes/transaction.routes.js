const express = require('express')
const transactionController = require('../controller/transaction.model')
const AuthMiddleware = require('../middleware/auth.middleware')
const router = express.Router()


router.post('/',AuthMiddleware , transactionController)


module.exports=router