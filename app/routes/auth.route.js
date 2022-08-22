module.exports = app => {
    const controller = require('../controller/auth.controller')

    const router = require('express').Router()

    router.use(function(req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        )
        next()
    })

    router.post('/login', controller.login)

    router.post('/logout', controller.logout)

    app.use('/api/auth', router)
}