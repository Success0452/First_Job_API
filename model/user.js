require('dotenv').config()
const { default: mongoose } = require("mongoose");
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'plrase provide name'],
        minlength: 3,
        maxlength: 30,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'please provide valid email'
        ], 
        unique: true
    },
    password: {
        type: String,
        required: [true, 'please provide password'],
        minlength: 4
    }
})

UserSchema.pre("save", async function(){
    const salt = await bcryptjs.genSalt(10)
    this.password = await bcryptjs.hash(this.password, salt)
})

UserSchema.methods.createJWT = function(){
    return jwt.sign({userid: this._id, username: this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword = async function(isPasswordCorrect){
   const isMatch = await bcryptjs.compare(isPasswordCorrect, this.password)
   return isMatch

}

module.exports = mongoose.model("User", UserSchema);