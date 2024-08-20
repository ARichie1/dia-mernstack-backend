const express = require('express');
const {ObjectId} = require('mongodb')
const User = require('../models/user');

// GET ALL USERS
const getUsers = (req, res) => {
    User.find()
    .then((data) => {
        res.status(200).render('users', {title: 'users', users: data});
    })
    .catch((err) => {
        res.status(404).render('index', {title: 'Home', error: err});
    })
}

// GET SIGN IN USER
const getUser = (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        let id = req.params.id;
        User.findById(ObjectId(id))
        .then((response) => {
            res.status(200).render('user', {title: `User : ${response.email}`, user: response});
        })
        .catch((err) => {
            res.status(404).render('login', {title: 'Users', error: err});
        })
    }
    else{
        res.redirect(`/signup`);
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