const { default: mongoose } = require("mongoose");

const jobSchema = new mongoose.Schema({
    company : {
        type: String,
        required: [true, 'Provide the company name'],
        maxlength: 50,
        trim: true
    },
    position : {
        type: String,
        required: [true, 'Please provide the position'],
        maxlength: 100,
        trim: true
    },
    status: {
        type: String,
        enum: ["interview", "pending", "declined"],
        default: "pending"
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],

    }
}, {timestamps: true})

module.exports = mongoose.model("Jobs", jobSchema);