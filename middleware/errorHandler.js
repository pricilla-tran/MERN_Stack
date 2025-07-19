// import helper function
const { logEvents } = require('./logger')

// overwrite default express errorhandling
const errorHandler = (err, req, res, next) => {
    // template literal, create log file
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.stack)

    const status = res.statusCode ? res.statusCode : 500 // server error 

    res.status(status)

    res.json({ message: err.message })
}

module.exports = errorHandler 