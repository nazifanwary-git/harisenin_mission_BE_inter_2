const mysql = require('mysql2')

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "vbAdmin",
    password: "videoBelajar123",
    database: "videobelajarDB"
})

module.exports = db