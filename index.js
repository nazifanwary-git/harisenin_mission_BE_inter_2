const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const db = require('./connection')
const response = require('./response')

app.use(bodyParser.json())


app.get('/', (req, res) => {
    response(200, 'API Ready', 'SUCCESS', res)
})

app.get('/user', (req, res) => {
    const sql = `SELECT * FROM user`
    db.query(sql, (err, rows) => {
        if (err) {
            return response(500, 'Internal Server Error', 'ERROR', res)
        }
        response(200, rows, 'SUCCESS', res)
    })
})

app.get('/user/:uid', (req, res) => {
    const uid = req.params.uid;
    const sql = `SELECT * FROM user WHERE user_id = ?`

    db.query(sql, [uid], (err, rows) => {
        if (err) {
            return response(500, null, err.message, res)
        }

        if (rows.length === 0) {
            return response(404, null, `user with id ${uid} not found`, res)
        }

        response(200, rows[0], 'SUCCESS', res)
    })
})

app.post('/user', (req, res) => {
    const { uid, fullname, email, phone, address } = req.body

    if (!uid || !fullname || !email) {
        return response(400, null, 'Missing required fields', res)
    }

    if (!email.includes('@')) {
        return response(400, null, 'Invalid email format', res)
    }

    const sql = `INSERT INTO user (user_id, fullname, email, phone, address, created_at)
    VALUES (?, ?, ?, ?, ?, NOW())`

    const values = [uid, fullname, email, phone, address]

    db.query(sql, values, (err, result) => {
        if (err) {
            return response(500, null, err.message, res)
        }
        response(201, {
            affectedRows: result.affectedRows,
            user_id: uid,
        }, 'USER CREATED SUCCESSFULLY', res)
    })
})

app.patch('/user/:uid', (req, res) => {
    const { uid } = req.params
    const { fullname } = req.body

    if (!fullname) {
        return response(400, null, 'Missing required fields', res)
    }

    const sql = `UPDATE user SET fullname = ? WHERE user_id = ?`

    db.query(sql, [fullname, uid], (err, result) => {
        if (err) {
            return response(500, null, err.message, res)
        }

        if (result.affectedRows === 0) {
            return response(404, null, `User with id ${uid} not found`, res)
        }

        response(200, {
            affectedRows: result.affectedRows,
            user_id: uid,
        }, 'FULLNAME UPDATED SUCCESSFULLY', res)
    })
})

app.delete('/user/:uid', (req, res) => {
    const { uid } = req.params

    if (!uid) {
        return response(400, null, 'Missing required fields', res)
    }

    const sql = `DELETE FROM user WHERE user_id = ?`
    const value = [uid]

    db.query(sql, value, (err, result) => {
        if (err) {
            return response(500, null, err.message, res)
        }
        if (result.affectedRows === 0) {
            return response(404, null, `User with id ${uid} not found`, res)
        }
        response(200, {
            affectedRows: result.affectedRows,
            user_id: uid
        }, 'USER DELETED SUCCESSFULLY', res)
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
