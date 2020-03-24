//to generate new token
//for encryption

const jwt = require('jsonwebtoken')

module.exports = {
    createJWTToken: (payload) => {
        return jwt.sign(payload, 'kucing', {
            expiresIn: '12h'
        })
    }
}