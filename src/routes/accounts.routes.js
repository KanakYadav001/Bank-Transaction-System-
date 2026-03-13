const express = require('express')
const AccountController = require('../controller/account.controller')
const AuthMiddleware = require('../middleware/auth.middleware')
const router = express.Router()

router.post('/',AuthMiddleware,AccountController)

module.exports=router