const express = require('express')
const AuthController = require('../controller/auth.controller')

const route = express.Router()


route.post('/register',AuthController.RegisterController)
route.post('/login',AuthController.LoginController)
route.post('/logout',AuthController.LogoutController)



module.exports=route