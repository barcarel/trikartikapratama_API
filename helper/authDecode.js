//to decode username and password from frontend
//to check whether token is right
//for decryption

const jwt = require('jsonwebtoken')

module.exports = {
    auth: (req, res, next) => {
        if(req.method !== 'OPTIONS'){
            jwt.verify(req.token, 'kucing', (err, decoded) => {
                if(err){
                    return res.status(401).json({
                        message: 'User Not Authorized'
                    })
                }
                // console.log(decoded)
                req.user = decoded //decode result from token
                next()
            })
        } else {
            next()
        }
    }
}