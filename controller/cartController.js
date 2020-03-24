const db = require('../database')
const Crypto = require('crypto')


module.exports = {
    getAllUserCart: (req, res) => {
        let sql =
            `select iduser, idproduct, name, categoryid, price, imagepath, productqty, price, totalprice from usercart u join allproducts a on u.idproduct = a.id where iduser=${req.user.id};`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            // console.log(results)
            res.status(200).send(results)
        })
    },

    postUserCart: (req, res) => {
        const { id, iduser, idproduct, productqty, status } = req.body
        let sql = `INSERT INTO usercart set ?`
        db.query(sql, req.body, (err, results) => {
            if (err) {
                console.log('error 1', err)
                return res.status(500).send('error insert user cart', err)
            }
            // return res.status(200).send(results)
            let sql2 =
                `select iduser, idproduct, name, categoryid, price, imagepath, productqty, totalprice from usercart u join allproducts a on u.idproduct = a.id where iduser=${req.body.iduser};`
            db.query(sql2, (err2, results) => {
                if (err2) {
                    console.log('error 2', err2)
                    res.status(500).send(err2)
                }
                res.status(200).send(results)
            })
        })
    },

    updateProductQty: (req, res) => {
        console.log(req.body)
        let sql = `
        SET SQL_SAFE_UPDATES=0;
        UPDATE usercart SET productqty=${req.body.totalqty}, totalprice=${req.body.totalprice} where idproduct=${req.body.idproduct} and iduser=${req.body.iduser};
        SET SQL_SAFE_UPDATES=1;
        `
        db.query(sql, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).send('error updating cart product qty', err)
            }
            return res.status(200).send(results)
        })
    },

    deleteUserCart: (req, res) => {
        // console.log(req.query.id)
        let sql =
            `SET SQL_SAFE_UPDATES=0;
        delete from usercart where iduser = ${req.query.iduser};
        SET SQL_SAFE_UPDATES=1;`

        db.query(sql, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).send('error delete user cart', err)
            }
            return res.status(200).send(results)
        })
    },

    deleteProductCart: (req, res) => {
        let sql =
            `SET SQL_SAFE_UPDATES=0;
        delete from usercart where iduser=${req.query.iduser} and idproduct=${req.query.idproduct};
        SET SQL_SAFE_UPDATES=1;`

        db.query(sql, (err, results) => {
            if (err) {
                return res.status(500).send('error delete product from user cart', err)
            }
            return res.status(200).send(results)
        })
    },

    getUserTransaction: (req, res) => {
        // console.log(req.query.iduser)
        let sql =
            `select * from transaction where iduser=${req.query.iduser}`
        db.query(sql, (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            }
            // console.log(results)
            res.status(200).send(results)
        })
    },

    // getUserTransactionWithStatus: (req, res) => {
    //     let sql = `select * from transaction where iduser =${req.query.iduser} and status='${req.query.status}';`

    //     db.query(sql, (err, results) => {
    //         if (err) {
    //             res.status(500).send(err)
    //         }
    //         res.status(200).send(results)
    //     })
    // },

    getAllTransactions: (req, res) => {
        let sql = `select * from transaction where status='${req.query.status}' ORDER by transactiontime desc`

        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    changeTransactionStatus: (req, res) => {
        // console.log(req.query)
        let sql = `
        SET SQL_SAFE_UPDATES=0;
        update transaction set status='${req.query.status}' where idtransaction='${req.query.idtransaction}';
        SET SQL_SAFE_UPDATES=1;
        `

        db.query(sql, (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send(err)
            } else {
                return res.status(200).send(results)
            }
        })
    },

    postUserTransaction: (req, res) => {
        // let {iduser, idproduct, fullname, phoneno, address, province, city, note, bank} = req.body
        idtransaction = Crypto.createHmac("sha256", "idtransaction").update(req.body.address + req.body.idproduct + req.body.iduser).digest("hex")
        idtransaction = idtransaction.substring(20, 10)
        // console.log(req.body)
        req.body.idtransaction = idtransaction
        let sql =
            `INSERT INTO transaction set ?`
        // console.log(req.body)
        db.query(sql, req.body, (err, results) => {
            if (err) {
                console.log(err)
                // res.status(500).send('error insert user transaction', err)
            }
            res.status(200).send(results)
        })
    },

    deleteUserTransaction: (req, res) => {
        console.log(req.query)
        let sql =
            `SET SQL_SAFE_UPDATES=0;
        delete from transaction where iduser=${req.query.iduser} and idtransaction=${db.escape(req.query.idtransaction)};
        SET SQL_SAFE_UPDATES=1;`

        db.query(sql, (err, results) => {
            if (err) {
                console.log(err)
                return res.status(500).send('error delete product from user cart', err)
            }
            return res.status(200).send(results)
        })
    },

}