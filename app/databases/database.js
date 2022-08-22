const sqlite3 = require('sqlite3').verbose()

const DB_SOURCE = 'db.sqlite'

const sql_create_user = `CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    pwd TEXT NOT NULL,
    type INTEGER NOT NULL,
    privilege INTEGER NOT NULL,
    extraInfo TEXT
)`

const sql_create_issue = `CREATE TABLE issue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    issueName TEXT NOT NULL,
    action INTEGER NOT NULL,
    targetName TEXT NOT NULL,
    ownerId INTEGER NOT NULL,
    status INTEGER NOT NULL,
    startTimeArr TEXT NOT NULL,
    completeTime TEXT,
    details TEXT,
    extraInfo TEXT
)`

const db = new sqlite3.Database(DB_SOURCE, err => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQLite database.')
})

db.run(sql_create_user, err => {
    if (err) {
        return console.error(err.message)
    }
    console.log('Create user table successfully!')
    const sql_insert_user = `INSERT INTO user (name, pwd, type, privilege) VALUES (?, ?, ?, ?)`
    const user = ['admin', 'admin', 1, 3]
    db.run(sql_insert_user, user, err => {
        if (err) {
            return console.error(err.message)
        }
        console.log('Initialize user table successfully!')
    })
})

db.run(sql_create_issue, err => {
    if (err) {
        return console.error(err.message)
    }
    console.log('Create issue table successfully!')
})

module.exports = db