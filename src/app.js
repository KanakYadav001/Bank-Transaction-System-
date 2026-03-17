const express = require('express')
const CookieParser = require('cookie-parser')
const AuthRoute = require('./routes/auth.routes')
const  AccoutRoutes = require('./routes/accounts.routes')
const transactionRouter = require('./routes/transaction.routes')
const app = express()

app.use(CookieParser())
app.use(express.json())



app.use('/api/auth',AuthRoute)
app.use('/api/account',AccoutRoutes)
app.use('/api',transactionRouter)

module.exports=app