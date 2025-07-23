require('dotenv').config()
// define express
const express = require('express')
// define app and call express
const app = express()
// import path from Node.js
const path = require('path')
// set port we run in dev, if there is no port, default to 3500
const PORT = process.env.PORT || 3500
// init logger
const { logger } = require('./middleware/logger')
// add errorHandler
const errorHandler = require('./middleware/errorHandler')
// built in middleware init
const cookieParser = require('cookie-parser')
// cors stuff
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConnection')
const mongoose = require('mongoose')
const { logEvents } = require('./middleware/logger')

console.log(process.env.NODE_ENV)

connectDB()

app.use(logger)
app.use(cors(corsOptions))
// app.use(cors(corsOptions))

// built in middleware function to parse incoming request bodies containing JSON payloads
app.use(express.json())

// detect cookies
app.use(cookieParser())

// telling express where to find static files like css or image
app.use('/', express.static(path.join(__dirname, 'public')))

// init router
app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.all('*', (req, res) => {
    // if response is 404
    res.status(404)
    if (req.accepts('html')) {
        // grab 404 html file
        res.sendFile(path.join(__dirname, 'views', '404.html'))
        // if json request was not routed properly
    } else if (req.accepts('json')) {
        // create json message
        res.json({ message: '404 Not Found' })
        // if html or json was not matches, make txt and send 404 message
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// add error handler
app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    // tell app to start listening, pass in port, and create function to print log for listening port
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})