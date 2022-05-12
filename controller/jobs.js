const { StatusCodes } = require('http-status-codes')
const { UnauthenticatedError, NotFoundError } = require('../errors')
const Job = require('../model/jobs')

const getAllJobs = async(req, res) => {
    const jobs = await Job.find({createdBy: req.user.userid}).sort("createdAt")
    return res.status(StatusCodes.OK).json({ jobs, count: jobs.length})
}

const createJob = async(req, res) => {
    req.body.createdBy = req.user.userid
    const job = await Job.create(req.body)
    return res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async(req, res) => {
    const { body: {company, position}} = req
    const {user: {userid}, params: {id: jobId}} = req

    if(!company || !position){
        throw new UnauthenticatedError('Provide position and company')
    }
    const job = await Job.findOneAndUpdate({createdBy: userid, _id: jobId}, req.body, {
        runValidators: true,
        new: true
    }).sort('createdAt')

    if(!job){
        throw new NotFoundError('Requested id not found')
    }

    return res.status(StatusCodes.OK).json({ job, count: job.length })
}

const getJob = async(req, res) => {
    const { user: { userid }, params:{id: jobId}} = req
    const job = await Job.findOne({createdBy: userid, _id: jobId})

    if(!job){
        throw new NotFoundError('Requested id not found')
    }
    return res.status(StatusCodes.OK).json({ job, count: job.length})
}

const deleteJob = async(req, res) => {
    const { user: {userid}, params: {id}} = req
    const job = await Job.findOneAndDelete({createdBy: userid, _id: id})

    if(!job){
        throw new NotFoundError('requested id not found')
    }

    return res.status(StatusCodes.OK).json({msg: `Item deleted`, success: true})
}

module.exports = {
    getAllJobs,
    getJob,
    updateJob,
    createJob,
    deleteJob
}