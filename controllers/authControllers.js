const User = require('../models/user');
const db = require('../app');
const jwt = require('jsonwebtoken');
const userDefaultsValues = require("../models/userDefaults")

// Function To Handle Authentication Errors
const handleErrors = (err) => {
    let errorsObject = {
        email: '', username: '', password: ''
    }
    if (err.message === 'Invalid Email Address') {
        errorsObject.email = 'Email Does Not Exist';
    }
    if (err.message === 'Invalid Password') {
        errorsObject.password = 'Password Not Correct, Check Password';
    }
    if (err.code == 11000) {
        errorsObject.email = 'Email as been used Already';
        return errorsObject;
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errorsObject[properties.path] = properties.message
        });
    }
    return errorsObject;
}

// Set Expiring Date(in seconds)
const maxAge = 3 * 60 * 60 * 24;

// Function To Create the JWT
const createToken = (id) => {
    return jwt.sign(
        {id},
        'richyrichyrichy',
        {expiresIn: maxAge}
    )
}

// Get SignUp Page
const signupPage = (req, res) => {
    res.render('signup', {title: "Sign Up", error: ""});
}

// Route Controllers

// SignUp User
const signup = (req, res) => {
    userDefaultsValues.email = req.body.email
    userDefaultsValues.password = req.body.password
    const user = new User(userDefaultsValues);
    user.save()
    .then((response) => {
        const token = createToken(user._id); 
        res.cookie('jwt', token, 
                {maxAge: 1000 * maxAge, httpOnly: true}
        )
        res.status(200).json({user: user._id});
    })
    .catch((err) => {
        console.log(err);
        let retrievedErrorsObject = handleErrors(err);
        res.status(404).json({errors: retrievedErrorsObject})
    })
}

// Get Login Page
const loginPage = (req, res) => {
    res.render('login', {title: "Login User", error: ""});
}

// Login User
const login = async (req, res) => {
    const{ email, password} = req.body;
    try{
        const user = await User.login(email, password);
        const token = createToken(user._id); 
        res.cookie('jwt', token, 
                {maxAge: 1000 * maxAge, httpOnly: true}
        )
        res.status(201).json({user: user._id});
    }
    catch (err) {
        const retrievedErrorsObject = handleErrors(err);
        res.status(404).json({errors: retrievedErrorsObject});
    }
}

// Logout User
const logout = async (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}

module.exports = {
    signupPage, signup, 
    loginPage, login, logout
}