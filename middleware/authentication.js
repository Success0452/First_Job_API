const jwt = require('jsonwebtoken')
const UnauthenticatedError = require('../errors/unauthenticated-error')
const auth = async(req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError('Invalid token')
    }

    const token = authHeader.split(' ')[1]

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {userid: payload.userid, username: payload.username}
        next()
    } catch (error) {
        throw new UnauthenticatedError('Encounterted Erro')
    }


}

module.exports = auth