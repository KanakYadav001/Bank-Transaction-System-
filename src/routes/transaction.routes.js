const express = require('express')
const {createInitialFundsTransaction,PerformTransaction} = require('../controller/transaction.controller')
const {AuthMiddleware,AuthSystemUser} = require('../middleware/auth.middleware')
const router = express.Router()


router.post('/transaction',AuthMiddleware,PerformTransaction)


router.post('/initial-funds', AuthSystemUser ,createInitialFundsTransaction)


module.exports=router