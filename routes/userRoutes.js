const express = require('express')
// define Router
const router = express.Router()
// import usersController
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)
// rest api at /users direct to controller
router.route('/')
    .get(usersController.getAllUsers) // read
    .post(usersController.createNewUser) // create
    .patch(usersController.updateUser) // update
    .delete(usersController.deleteUser) // remove

// module.exports makes it available using a require()
module.exports = router