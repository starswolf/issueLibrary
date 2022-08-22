module.exports = app => {
    const controller = require('../controller/issue.controller')
    const { verifyToken, isAdminOrOwnIssue } = require('../middleware/authJwt')

    const router = require('express').Router()

    router.use(function(req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        )
        next()
    })

    router.post('/', [verifyToken], controller.createIssue)

    router.put('/:id', [verifyToken, isAdminOrOwnIssue], controller.updateIssue)

    router.get('/', [verifyToken], controller.getIssues)

    router.delete('/:id', [verifyToken, isAdminOrOwnIssue], controller.deleteIssue)

    app.use('/api/issue', router)
}