const jwt = require('jsonwebtoken')
const database = require('../databases/database')
const config = require('../config/authConfig')

exports.login = (req, res) => {
    const { name, pwd } = req.body
    const sql = 'SELECT * FROM user WHERE (name = ?)'
    database.all(sql, [name], (err, rows = []) => {
        if (err) {
            res.status(500).send({ message: err.message })
            return console.error(err.message)
        }
        if (rows.length === 0) {
            return res.status(403).send({ message: '找不到该用户名!' })
        }
        if (rows[0].pwd === pwd) {
            const accessToken = jwt.sign({ id: rows[0].id }, config.secret, { expiresIn: 1800 })
            return res.status(201).send({ id: rows[0].id, accessToken })
        } else {
            return res.status(403).send({ message: '用户名或密码错误，请重新输入！' })
        }
    })
}

exports.logout = (req, res) => {
    return res.status(401).send()
}