const database = require('../databases/database')

exports.createIssue = (req, res) => {
    const sql = 'INSERT INTO issue ' +
        '(issueName, action, targetName, ownerId, status, startTimeArr, details) ' + 
        'VALUES (?, ?, ?, ?, ?, ?, ?)'
    const issue = [req.body.issueName, req.body.action, req.body.targetName, req.body.ownerId,
        req.body.status, JSON.stringify(req.body.startTimeArr), req.body.details]
    database.run(sql, issue, err => {
        if (err) {
            res.status(500).send({ message: err.message })
            return console.error(err.message)
        }
        res.status(201).send({ message: '添加案件成功!' })
    })
}

exports.updateIssue = (req, res) => {
    const id = req.params.id
    const sql = 'UPDATE issue SET ' +
        'issueName = ?, action = ?, targetName = ?, ownerId = ?, status = ?, startTimeArr = ?, ' +
        'completeTime = ?, details = ? ' +
        'WHERE (id = ?)'
    const issue = [req.body.issueName, req.body.action, req.body.targetName, req.body.ownerId,
        req.body.status, JSON.stringify(req.body.startTimeArr), req.body.completeTime, req.body.details, id]
    database.run(sql, issue, err => {
        if (err) {
            res.status(500).send({ message: err.message })
            return console.error(err.message)
        }
        res.status(204).send()
    })
}

exports.getIssues = (req, res) => {
    const userSql = 'SELECT * FROM user WHERE id = ?'
    database.all(userSql, [req.userId], (err, rows = []) => {
        if (err) {
            res.status(500).send({ message: err.message })
            return console.error(err.message)
        }
        if (rows.length === 1) {
            let privilege = rows[0].privilege
            if (privilege === 0) {
                res.status(200).send({ issues: [] })
            } else {
                const issueSql = 'SELECT * FROM issue ORDER BY id'
                database.all(issueSql, [], (issueErr, issueRows = []) => {
                    if (issueErr) {
                        res.status(500).send({ message: issueErr.message })
                        return console.error(issueErr.message)
                    }
                    const result = []
                    issueRows.forEach(row => {
                        delete row.extraInfo
                        if (privilege === 1) {
                            if (row.action === 3) return
                        } else if (privilege === 2) {
                            if (row.action !== 3) return
                        }
                        row.startTimeArr = JSON.parse(row.startTimeArr)
                        result.push(row)
                    })
                    res.status(200).send({ issues: result })
                })
            }
        }
    })
}

exports.deleteIssue = (req, res) => {
    const id = req.params.id
    const sql = 'DELETE FROM issue WHERE id = ?'
    database.run(sql, id, err => {
        if (err) {
            res.status(500).send({ message: err.message })
            return console.error(err.message)
        }
        res.status(204).send()
    })
}
