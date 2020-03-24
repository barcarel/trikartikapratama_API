const db = require('../database')
const Crypto = require('crypto')
const { createJWTToken } = require('../helper/jwtEncode')

module.exports = {
    login: (req, res) => {
        const { username, password, role } = req.body
        // console.log(req.body)
        let hashPassword = Crypto.createHmac("sha256", "kucing").update(password).digest("hex")
        // console.log(hashPassword)
        let sql = `SELECT * FROM user where username='${username}' and password='${hashPassword}' and role='${role}';`
        db.query(sql, (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            }
            console.log(results)
            if (results.length !== 0) {
                let { id, username, password, firstname, lastname, phoneno, company, status, role } = results[0]
                const token = createJWTToken({ id, username, firstname, lastname, phoneno, company, status, password, role })
                // console.log(results[0])
                return res.status(200).send({ id, username, firstname, lastname, phoneno, company, status, token, role })
            } else {
                return res.status(500).send("Invalid")
            }
        })
        // console.log(username, password)
    },

    keepLogin: (req, res) => {
        res.status(200).send({ ...req.user, token: req.token })
    },

    userRegister: (req, res) => {
        const { username, password, role } = req.body
        // console.log(req.body)
        let hashPassword = Crypto.createHmac("sha256", "kucing").update(password).digest("hex")
        // console.log(hashPassword)
        let sql = `INSERT INTO user (username, password, role) VALUES ('${username}', '${hashPassword}', '${role}');`

        db.query(sql, req.body, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            // res.status(200).send(results)
            const { username, password, role } = req.body
            // console.log(req.body)
            let hashPassword = Crypto.createHmac("sha256", "kucing").update(password).digest("hex")
            // console.log(hashPassword)
            let sql = `SELECT * FROM user where username='${username}' and password='${hashPassword}' and role='${role}';`

            db.query(sql, (err, results) => {
                if (err) {
                    // console.log(err)
                    res.status(500).send(err)
                }
                console.log(results)
                if (results.length !== 0) {
                    let { id, username, password, firstname, lastname, phoneno, company, status, role } = results[0]
                    const token = createJWTToken({ id, username, firstname, lastname, phoneno, company, status, password, role })
                    // console.log(results[0])
                    return res.status(200).send({ id, username, firstname, lastname, phoneno, company, status, token, role })
                } else {
                    return res.status(500).send("Invalid")
                }
            })
        })
    },
    userUpdateDetail: (req, res) => {
        console.log('TES', req.body)
        const { id, firstname, lastname, phoneno, company } = req.body
        let sql = `UPDATE user SET firstname='${firstname}', lastname='${lastname}', phoneno='${phoneno}', company='${company}' WHERE id=${id};`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            // console.log(results)
            let sqlNew = `SELECT * from user where id=${id}`
            db.query(sqlNew, (err, results) => {
                if (err) {
                    res.status(500).send(err)
                }
                let { id, username, password, firstname, lastname, phoneno, company, status, role } = results[0]
                console.log('cece', id, username, password, firstname, lastname, phoneno, company, status, role)
                const token = createJWTToken({ id, username, firstname, lastname, phoneno, company, status, password, role })
                res.status(200).send(token)
            })
        })
    },

    userChangePassword: (req, res) => {
        // console.log(req.body)
        const { id, oldpassword, newpassword, confirmnewpassword } = req.body
        let hashPassword = Crypto.createHmac("sha256", "kucing").update(oldpassword).digest("hex")
        let sql = `select * from user where id=${id} and password='${hashPassword}'`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            // console.log(results)
            // res.status(200).send(results)
            if (results.length > 0) {

                let hashPasswordNew = Crypto.createHmac("sha256", "kucing").update(newpassword).digest("hex")
                let sqlUpdate = `UPDATE user SET password='${hashPasswordNew}' where id=${id};`
    
                db.query(sqlUpdate, (err, results) => {
                    if (err) {
                        res.status(500).send(err)
                    }
                    res.status(200).send(results)
                })
            } else {
                res.status(200).send("wrongpassword")
            }
        })
    },

    getAllUsers: (req, res) => {
        let sql = `select * from user where role='${req.query.role}'`

        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            // console.log('berhasil dapet')
            res.status(200).send(results)
        })
    }
}