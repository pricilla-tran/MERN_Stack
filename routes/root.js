const express = require('express')
// define Router
const router = express.Router()
const path = require('path')

// get request, we can use regex to find the route, made html optional
router.get('^/$|/index(.html)?', (req, res) => {
    // send file back as a response, __dirname, then say which folder and file
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router