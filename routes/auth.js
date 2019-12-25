const express = require('express')
const router = express.Router()

const { isAuth, notAuth } = require('../middleware/auth')

const authController = require('../controllers/auth')

//= Get Login Page route
router.get('/login', notAuth, authController.getLoginPage)


//= post Login route
router.post('/login', notAuth, authController.login)

//= get register page route
router.get('/register', notAuth, authController.getRegisterPage )


//= port register route
router.post('/register', notAuth, authController.register)


//= logout route.......
router.get('/logout', isAuth, authController.logout )


//= get dashboard page route.....
router.get('/dashboard', isAuth, authController.getDashboardPage )



module.exports = router