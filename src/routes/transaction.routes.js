const express = require('express')
const transactionController = require('../controller/transaction.controller')
const {AuthMiddleware,AuthSystemUser} = require('../middleware/auth.middleware')
const router = express.Router()


router.post('/transaction',AuthMiddleware, transactionController)


router.post('/initial-funds', AuthSystemUser ,transactionController)


module.exports=router