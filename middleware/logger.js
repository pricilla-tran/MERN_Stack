const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logFileName) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        // if no logs directory
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            // make directory
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        // appending to logfile
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

// writing the middleware, ability to call next
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    // move onto the next piece of middleware
    next()
}

//export so we can use them
module.exports = { logEvents, logger }