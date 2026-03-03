const express = require('express')
const CookieParser = require('cookie-parser')
const AuthRoute = require('./routes/auth.routes')
const app = express()

app.use(CookieParser())
app.use(express.json())



app.use('/api/auth',AuthRoute)


module.exports=app