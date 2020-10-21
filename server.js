const express = require('express')
const helmet = require("helmet")
const bodyParser = require('body-parser')
const app = express()
const userRouter = require('./routes/user-router')
const msgRouter = require('./routes/message-router')

app.use(helmet());

app.use((req, res, next) => { //CORS HEADERS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
})

app.use(bodyParser.json())



app.use('/api/', userRouter)
app.use('/api/', msgRouter)

app.listen(3000, () => console.log(`app listening at http://localhost:${3000}/api/`))