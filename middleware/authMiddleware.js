const jwt = require('jsonwebtoken')
const User = require('../models/user')

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
        req.user = await User.findOne({id}).select("_id")
        next()
    }
    catch (err) {
        res.status(401).json({
            error: "Request is not authorized"
        })
    }
}

// Dectect Logged In User To Feed Them With Thier Data
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'richyrichyrichy', async (err, decodeToken) => {
            if (err) {
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                let user = await User.findById(decodeToken.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth, checkUser}