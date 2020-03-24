const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const PORT = 3310
const bearerToken = require('express-bearer-token') // yg ngebawa dr auth nya frontend

const app = express()

app.use(cors())
app.use(bodyParser())
app.use(bearerToken()) //get token based on header sent by frontend action
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public')) //folder location for API pics

const {productRouter, userRouter, cartRouter} = require('./router')

app.use('/user', userRouter)
app.use('/products', productRouter)
app.use('/cart', cartRouter)

app.listen(PORT, () => console.log(PORT))