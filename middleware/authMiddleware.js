const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Gives Permission To Only Logged In Users To Access Certain Pages
const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, 'richyrichyrichy', (err, decodeToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/api/user/login');
            } else {
                next();
            }
        })
    } else {
        res.redirect('/api/user/login');
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