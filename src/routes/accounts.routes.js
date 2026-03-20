const express = require('express')
const { CreateAccount, GetAccountController,GetAccountBalance} = require('../controller/account.controller')
const {AuthMiddleware} = require('../middleware/auth.middleware')
const router = express.Router()

router.post('/create',AuthMiddleware,CreateAccount)

router.get('/Showaccount',AuthMiddleware,GetAccountController)
router.get('/getBalance/:AccountId',AuthMiddleware,GetAccountBalance)

module.exports=router