const express = require('express');
const {ObjectId} = require('mongodb')
const User = require('../models/user');
const { inGame, settings, username, socials } = require('../models/userDefaults');

// GET ALL USERS
const getUsers = async (req, res) => {
    try {
        console.log((req.user._id).toString());
        const users = await User.find({})
        res.status(200).json({users});
    } catch (error) {
        res.status(404).json({errors: "request failed"})
    }
}

// GET SIGN IN USER
const getUser = async (req, res) => {
    try {
        let id = (req.user._id).toString()
        const user = await User.findById(ObjectId(id))
        
        console.log(user.socials);
        
        const userDetails = {
            email: user.email,
            username: user.username,
            country: user.country,
            profileImage: user.profileImage,
            socials: user.socials,
            finance: user.finance,
            inGame: user.inGame,
            gameHistory: user.gameHistory,
            settings: user.settings
        }
        res.status(200).json({user: userDetails});
    } catch (error) {
        res.status(404).json({errors: "request failed"})
    }
}

// 62db0ca1dc63da4b9c5f1d80

// 62db0d02dc63da4b9c5f1d85
// GET SIGN IN USERs
const viewAnotherUser = async (req, res) => {
    if (ObjectId.isValid(req.params.myid) && ObjectId.isValid(req.params.theirid)) {
        let myid = req.params.myid;
        let theirid = req.params.theirid;
        try{
            let loggedInUser = await User.findById(ObjectId(myid))
            let viewedUser = await User.findById(ObjectId(theirid))
            res.status(200).render('user', {title: `User : ${viewedUser.email}`, loggedInUser, viewedUser});
        }
        catch(err){
            res.status(404).render('login', {title: 'Users', error: err});
        }
    }
    else{
        res.redirect(`/signup`);
    }
}


// UPDATE USER CREDENTIAL
const updateUser = (req, res) => {
    if (ObjectId.isValid(req.params.id)){
        let id = req.params.id;
        User.findByIdAndUpdate(ObjectId(id), {$set: req.body})
        .then((user) => {
            res.redirect(`/user/${user.id}`)
            // res.status(200).render('user', {title: 'Update User', user})
        })
        .catch((err) => {
            res.status(404).render('user-update', {title: 'Update User', error: err})
        })
    }
}

// DELETE USER ACCOUNT
const deleteUser = (req, res) => {
    if (ObjectId.isValid(req.params.id)){
        let id = req.params.id;
        User.findByIdAndDelete(ObjectId(id))
        .then((user) => {
            res.redirect(`/users`);
        })
        .catch((err) => {
            res.redirect(`/user/${id}`);
        })
    }
}

module.exports = {
    getUsers, getUser, viewAnotherUser,
    updateUser, deleteUser
}