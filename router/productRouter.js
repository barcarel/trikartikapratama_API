const express = require('express')
const { productController } = require('../controller')
const router = express.Router()

//ADMIN
router.get('/getAllProducts', productController.getAllProducts)
router.post('/postProduct', productController.postProduct)
router.delete('/deleteProduct', productController.deleteProduct)
router.post('/editProduct', productController.editProduct)
router.get('/getProductLimit', productController.getProductLimit)
router.get('/getups', productController.getUPS)
router.get('/getBattery', productController.getBattery)

//user
router.get('/getoneproduct', productController.getOneProduct)


module.exports = router
