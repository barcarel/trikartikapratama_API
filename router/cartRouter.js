const express = require('express')
const { productController } = require('../controller')
const { cartController } = require('../controller')
const router = express.Router()
const { auth } = require('../helper/authDecode')


router.get('/getAllUserCart', auth, cartController.getAllUserCart)
router.post('/postUserCart', cartController.postUserCart)
router.post('/updateProductQty', cartController.updateProductQty)
router.delete('/deleteUserCart', cartController.deleteUserCart)
router.delete('/deleteProductCart', cartController.deleteProductCart)

router.get('/getUserTransaction', cartController.getUserTransaction)
// router.get('/getAllUserTransaction', cartController.getAllUserTransaction)
router.get('/getAllTransactions', cartController.getAllTransactions)
// // router.get('/getUserTransactionWithStatus', cartController.getUserTransactionWithStatus)
router.post('/changeTransactionStatus', cartController.changeTransactionStatus)
router.post('/postUserTransaction', cartController.postUserTransaction)
router.delete('/deleteUserTransaction', cartController.deleteUserTransaction)


module.exports = router