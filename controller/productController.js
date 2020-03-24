const db = require('../database')
const { uploader } = require('../helper/uploader')
const fs = require('fs')

module.exports = {

    getAllProducts: (req, res) => {
        let sql =
            `select * from allproducts`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    postProduct: (req, res) => {
        console.log('uploader')
        console.log(req.files)
        // console.log(req.files.image)
        // console.log(req.files.pdf)

        try {
            // const path = '/images'
            // const pathpdf = '/pdf'
            // const pathspec = '/specification'
            const upload = uploader("/files", 'FILES').fields([{ name: 'image' }, { name: 'specification' }])
            // const uploadpdf = uploader(pathpdf, 'PDF').fields([{ name: 'pdf' }])
            // const uploadspec = uploader(pathspec, 'FILES').fields([{ name: 'specification' }])

            upload(req, res, (err) => {
                if (err) {
                    console.log('error uploading image')
                    return res.status(500).send({ message: 'error uploading image' })
                }
                const { image, specification } = req.files
                console.log(image)
                const imagePath = image ? "/files" + '/' + image[0].filename : null
                const specPath = specification ? "/files" + '/' + specification[0].filename : null
                console.log('add', req.body.data)
                const data = JSON.parse(req.body.data) //balikin dr format JSON ke format obj biasa
                data.imagepath = imagePath
                data.specification = specPath
                console.log(data)
                let sql = `INSERT INTO allproducts set ?;`
                db.query(sql, data, (err, results) => {
                    if (err) {
                        console.log(err)
                        fs.unlinkSync('./public' + imagePath) //delete file kalo sql nya error
                        fs.unlinkSync('./public' + specPath)
                        return res.status(500).send(results)
                    }
                    console.log(results.insertId) //ambil id stelah data di push
                    // uploadpdf(req, res, (err) => {
                    //     if (err) {
                    //         console.log('error uploading pdf')
                    //         return res.status(500).send({ message: 'error uploading pdf' })
                    //     }
                    //     const { pdf } = req.files
                    //     console.log(pdf)
                    //     const data = JSON.parse(req.body.data) //balikin dr format JSON ke format obj biasa
                    //     // data.pdf = pdfPath
                    //     // console.log(data)
                    //     let sqlPdf = `UPDATE allproducts SET pdf = '${pdfPath}' where id=${results.insertId};`
                    //     db.query(sqlPdf, (err, results) => {
                    //         if (err) {
                    //             console.log(err)
                    //             fs.unlinkSync('./public' + imagePath) //delete file kalo sql nya error
                    //             return res.status(500).send(results)
                    //         }
                    //     })
                    // })
                    return res.status(200).send(results)
                })
            })
        } catch (err) {
            return res.status(500).send({ message: 'error' })
        }
    },

    editProduct: (req, res) => {
        // console.log(req.query.id)

        try {
            const path = '/files'
            const upload = uploader("/files", 'FILES').fields([{ name: 'image' }, { name: 'specification' }])
            upload(req, res, (err) => {
                if (err) {
                    console.log('err1', err)
                    return res.status(500).send({ message: 'error' })
                }
                // console.log(req.body.data)
                // console.log('edit', req.body.data)
                const { image, specification } = req.files
                // console.log(image,pdf,specification)
                const data = JSON.parse(req.body.data)
                let sql = `UPDATE allproducts SET ? WHERE id = ${req.query.id}`
                if (image == undefined && specification == undefined) {
                    db.query(sql, data, (err2, results) => {
                        if (err2) {
                            console.log('err2', err2)
                            return res.status(500).send({ message: 'error' })
                        }
                        return res.status(200).send({ results })
                    })
                } else {
                    let sqlget = `SELECT * FROM allproducts where id=${req.query.id}`
                    db.query(sqlget, (errGet, resultGet) => {
                        if (errGet) {
                            console.log('err3', errGet)
                            res.status(500).send('problem when GET during submit edit', errGet)
                        }
                        else if (resultGet !== 0) {
                            let oldImage = resultGet[0].imagepath
                            let oldSpec = resultGet[0].specification
                            const imagePath = image ? path + '/' + image[0].filename : null
                            const specPath = specification ? path + '/' + specification[0].filename : null
                            if (image && specification) {
                                data.imagepath = imagePath
                                data.specification = specPath
                            } else if (image) {
                                data.imagepath = imagePath
                            } else if (specification) {
                                data.specification = specPath

                            }
                            db.query(sql, data, (err, results) => {
                                if (err) {
                                    console.log('err4', err)
                                    // fs.unlinkSync('./public' + imagePath) // delete file
                                    // fs.unlinkSync('./public' + specPath) // delete file
                                    return res.status(500).send({ message: 'error' })
                                }
                                if (image && specification) {
                                    // fs.unlinkSync('./public' + oldImage) // delete file
                                    // fs.unlinkSync('./public' + oldSpec) // delete file
                                }
                                return res.status(200).send(results)
                            })
                        }
                    })
                }
            })
        } catch (err) {
            console.log('err5', err)
            return res.status(500).send({ message: 'error' })
        }
    },

    deleteProduct: (req, res) => {
        console.log(req.query)

        let sql = `DELETE from allproducts where id=${req.query.id};`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            // fs.unlinkSync('./public' + req.query.imagepath)
            // // fs.unlinkSync('./public' + req.query.pdf)
            // fs.unlinkSync('./public' + req.query.specification)
            res.status(200).send(results)
        })
    },

    getUPS: (req, res) => {
        let sql = `SELECT * FROM allproducts where categoryid = 1;`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    getBattery: (req, res) => {
        let sql = `SELECT * FROM allproducts where categoryid = 2;`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    getOneProduct: (req, res) => {
        // console.log('id nya brok', req.query.id)
        let sql = `SELECT * FROM allproducts where id = ${req.query.id};`
        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    },

    getProductLimit: (req, res) => {
        let sql = `SELECT * from allproducts limit ${req.query.datalimit},3`

        db.query(sql, (err, results) => {
            if (err) {
                res.status(500).send(err)
            }
            res.status(200).send(results)
        })
    }
}