module.exports = app => {
    const controller = require('../controller/user.controller')
    const { verifyToken, isAdmin, isOwn } = require('../middleware/authJwt')

    const router = require('express').Router()

    router.use(function(req, res, next) {
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, Content-Type, Accept'
        )
        next()
    })

    router.post('/', [verifyToken, isAdmin], controller.createUser)

    router.put('/:id', [verifyToken, isAdmin], controller.updateUser)

    router.put('/updatePwd/:id', [verifyToken, isOwn], controller.updateUserPwd)

    router.get('/', [verifyToken], controller.getAllUsers)

    router.delete('/:id', [verifyToken, isAdmin], controller.deleteUser)

    app.use('/api/user', router)
}