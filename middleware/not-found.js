const { StatusCodes } = require("http-status-codes")

const notFound = (req, res) => {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Requested route not found')
}

module.exports = notFound;