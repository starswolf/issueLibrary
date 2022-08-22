const database = require('../databases/database')

exports.createUser = (req, res) => {
    const sql = `INSERT INTO user (name, pwd, type, privilege) VALUES (?, ?, ?, ?)`
    const user = [req.body.name, req.body.pwd, req.body.type, req.body.privilege]
    database.run(sql, user, err => {
        if (err) {
            res.status(500).send({ message: err.message })
            return console.error(err.message)
        }
        res.status(201).send({ message: `添加用户 ${req.body.name} 成功!` })
    })
}

exports.updateUser = (req, res) => {
    const id = req.params.id
    const userSql = 'SELECT * FROM user WHERE id = ?'
    database.all(userSql, [id], (err, rows = []) => {
        if (err) {
            res.status(500).send({ message: err.message })
            return console.error(err.message)
        }
        if (rows.length === 1) {
            let { name = rows[0].name, pwd = rows[0].pwd, type = rows[0].type, privilege = rows[0].privilege } = req.body
            const sql = 'UPDATE user SET name = ?, pwd = ?, type = ?, privilege = ? WHERE (id = ?)'
            const user = [name, pwd, type, privilege, id]
            database.run(sql, user, err => {
                if (err) {
                    res.status(500).send({ message: err.message })
                    return console.error(err.message)
                }
                res.status(204).send()
            })
        }
    })
}

exports.updateUserPwd = (req, res) => {
    const id = req.params.id
    const userSql = 'SELECT * FROM user WHERE id = ?'
    database.all(userSql, [id], (err, rows = []) => {
        if (err) {
            res.status(500).send({ message: err.message })
            return console.error(err.message)
        }
        if (rows.length === 1) {
            let { name = rows[0].name, oldPwd, newPwd, type = rows[0].type, privilege = rows[0].privilege } = req.body
            if (rows[0].pwd !== oldPwd) {
                res.status(500).send({ message: '旧密码错误，请重新输入！' })
                return console.error('Incorrect old password for user ' + id)
            }
            const sql = 'UPDATE user SET name = ?, pwd = ?, type = ?, privilege = ? WHERE (id = ?)'
            const user = [name, newPwd, type, privilege, id]
            database.run(sql, user, err => {
                if (err) {
                    res.status(500).send({ message: err.message })
                    return console.error(err.message)
                }
                res.status(204).send()
            })
        }
    })
}

exports.getAllUsers = (req, res) => {
    const sql = 'SELECT * FROM user ORDER BY id'
    database.all(sql, [], (err, rows = []) => {
        if (err) {
            res.status(500).send({ message: err.message })
            return console.error(err.message)
        }
        rows.forEach(row => {
            delete row.extraInfo
            delete row.pwd
        })
        res.status(200).send({ users: rows })
    })
}

exports.deleteUser = (req, res) => {
    const id = req.params.id
    const sql = 'DELETE FROM user WHERE id = ?'
    database.run(sql, id, err => {
        if (err) {
            res.status(500).send({ message: err.message })
            return console.error(err.message)
        }
        res.status(204).send()
    })
}
