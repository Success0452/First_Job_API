const { StatusCodes } = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const User = require('../model/user')

const register = async(req, res) => {

    const user = await User.create({...req.body})
    const token = user.createJWT()
    return res.status(StatusCodes.CREATED).json({ user:{ name: user.name}, token })
}

const login = async(req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        throw new BadRequestError('Provide valid email and password')
    }

    const user = await User.findOne({email})

    if(!user){
        throw new UnauthenticatedError('account is not found in the database')
    }

    const checkPassword = await user.comparePassword(password)
    if(!checkPassword){
        throw new UnauthenticatedError("Password is incorrect")
    }

    const token = user.createJWT()

    return res.status(StatusCodes.OK).json({user: {name: user.name}, token})
}

module.exports = {
    register,
    login
}