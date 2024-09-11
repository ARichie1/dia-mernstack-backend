const jwt = require('jsonwebtoken')
const User = require('../models/user')
const {ObjectId} = require('mongodb')

// Gives Permission To Only Logged In Users To Access Certain Pages
const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({
            error: "Authorization token required"
        })
    }

    const token = authorization.split(" ")[1]
    
    try{
        const {id} = jwt.verify(token, process.env.SECRET)
        req.user = await User.findById(ObjectId(id)).select("_id")
        next()
    }
    catch (err) {
        res.status(401).json({
            error: "Request is not authorized"
        })
    }
}

module.exports = {requireAuth}