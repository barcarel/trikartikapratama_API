const mysql = require('mysql')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'dbtrikartikapratama',
    port: 3306,
    multipleStatements: true
})

module.exports = db;
