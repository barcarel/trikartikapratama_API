const express = require('express')
const { userController } = require('../controller')
const router = express.Router()
const { auth } = require('../helper/authDecode')


router.get('/getallusers', userController.getAllUsers)
router.post('/login', userController.login)
router.post('/keepLogin', auth, userController.keepLogin)
router.post('/userRegister', userController.userRegister)
router.post('/userupdatedetail', userController.userUpdateDetail)
router.put('/userchangepassword', userController.userChangePassword)

module.exports = router
