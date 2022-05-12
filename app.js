require('dotenv').config();
require('express-async-errors');


const express = require('express')
const app = express()

const connectDB = require('./db/connect')
const authenticateUser = require('./middleware/authentication')

const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

// extra security
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')

// middleware
app.use(express.json())

app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 100, //15 min
    max: 100, // limit each ip to 100 requests per windowMs
}))

app.use(helmet())
app.use(cors())
app.use(xss())

// routes
app.get('/', (req, res) => {
    return res.status(200).send('Jobs-API');
})


app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticateUser, jobsRouter)

// error handling
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// app start 

const port = process.env.PORT || 3000

const start = async() => {
    try {
        //connectDB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()