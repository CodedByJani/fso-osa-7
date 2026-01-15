const router = require('express').Router()
const usersController = require('../controllers/users')

router.get('/', usersController.getUsers)
router.post('/', usersController.createUser)

console.log('usersController:', usersController)


module.exports = router
