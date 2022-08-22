const jwt = require('jsonwebtoken')
const config = require('../config/authConfig')
const database = require('../databases/database')

verifyToken = (req, res, next) => {
    let token = req.headers['x-access-token']

    if (!token) {
        return res.status(401).send()
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send()
        }
        req.userId = decoded.id + ''
        next()
    })
}

isAdmin = (req, res, next) => {
    const sql = 'SELECT * FROM user WHERE id = ?'
    database.all(sql, [req.userId], (err, rows = []) => {
        if (err) {
            res.status(500).send({ message: err.message })
            return console.error(err.message)
        }
        if (rows.length === 1 && rows[0].type === 1) {
            next()
            return
        }
        res.status(403).send({ message: '该操作需要管理员权限!' })
    })
}

isOwn = (req, res, next) => {
    if (req.params.id === req.userId) {
        next()
        return
    }
    res.status(403).send({ message: '该操作只能由用户自己完成！' })
}

isAdminOrOwnUser = (req, res, next) => {
    if (req.params.id === req.userId) {
        next()
        return
    }
    const sql = 'SELECT * FROM user WHERE id = ?'
    database.all(sql, [req.userId], (err, rows = []) => {
        if (err) {
            res.status(500).send({ message: err.message })
            return console.error(err.message)
        }
        if (rows.length === 1 && rows[0].type === 1) {
            next()
            return
        }
        res.status(403).send({ message: '只有该用户本身或者管理员才能做此操作!' })
    })
}

isAdminOrOwnIssue = (req, res, next) => {
    const issueSql = 'SELECT * FROM issue WHERE id = ?'
    database.all(issueSql, [req.params.id], (err, rows = []) => {
        if (err) {
            res.status(500).send({ message: err.message })
            return console.error(err.message)
        }
        if (rows.length === 1) {
            const issue = rows[0]
            if ((issue.ownerId + '') === req.userId) {
                next()
                return
            }
            const sql = 'SELECT * FROM user WHERE id = ?'
            database.all(sql, [req.userId], (userErr, userRows = []) => {
                if (userErr) {
                    res.status(500).send({ message: userErr.message })
                    return console.error(userErr.message)
                }
                if (userRows.length === 1 && userRows[0].privilege === 3) {
                    next()
                    return
                }
                res.status(403).send({ message: '只有负责人或者管理员才能做此操作!' })
            })
        }
    })
}

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isOwn: isOwn,
    isAdminOrOwnUser: isAdminOrOwnUser,
    isAdminOrOwnIssue: isAdminOrOwnIssue
}
module.exports = authJwt
