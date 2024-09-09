const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcryptjs')
const userDefaultsValues = require("../models/userDefaults")

const DepositSchema = new mongoose.Schema({
    token : {type: String,}, 
    chain : {type: String,},
    depositType : {type: String,},
    senderAddress : {type: String,}, 
    unitDeposited : {type: Number}
}, {timestamps: true})

const TokenSchema = new mongoose.Schema({
    balance : {type: Number},
    depositHistory: [DepositSchema]
})

const purchaseHistorySchema = new mongoose.Schema({
    item: {type: String},
    purchasedWith: {type: String},
    amountPurchased: {type: String},
    unitPurchased: {type: String}
}, {timestamps: true})

const FinanceSchema = new mongoose.Schema({
    address: {type: Number},
    keys: [TokenSchema],
    dia: [TokenSchema],
    usdt: [TokenSchema],
    purchaseHistory : [purchaseHistorySchema ]
})

const GuessesSchema = new mongoose.Schema({
    title : String,
    pages : Number
})

const PowerUpSchema = new mongoose.Schema({
    active: {type: Boolean},
    duration: {type: Number}
})

const PowerUpsSchema = new mongoose.Schema({
    timeFreezer: [PowerUpSchema],
    timeBooster: [PowerUpSchema],
    moveBooster: [PowerUpSchema],
    detectiveMode: [PowerUpSchema],
    wizardMode: [PowerUpSchema]
})

const InGameSchema = new mongoose.Schema({
    connected: {type: Boolean},
    ready: {type: Boolean},
    host: {type: Boolean},
    join: {type: Boolean},
    opponent: {type: Object},
    wins : {type: Number},
    losses : {type: Number},
    won : {type: Boolean},
    lose : {type: Boolean},
    myCode: {type: String},
    myGuesses : [GuessesSchema],
    opponentsGuesses : [GuessesSchema],
    moves : {type: Number},
    time : {type: Number},
    powerUps : [PowerUpsSchema]
})

const SettingsSchema = new mongoose.Schema({
    theme : {type: String},
    sound : {type: Boolean},
    audio : {type: Boolean},
    language : {type: String}
})

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please Enter an Email'],
        unique: true,
        lowercase: true,
        validation: [isEmail, 'Please Enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please Enter a password'],
        minLength: [6, 'Minimum Password Length is 6 Characters']
    },
    username : {type: String},
    country: {type: String},
    imgSrc: {type: String},
    finance: {
        address: {type: Number},
        keys: [TokenSchema],
        dia: [TokenSchema],
        usdt: [TokenSchema],
        purchaseHistory : [purchaseHistorySchema]
    },
    inGame: [InGameSchema],
    settings: [SettingsSchema]
}, {timestamps: true});

// Fire A Function Before Document Is Saved To DB,
// Encrypt Password From Sign Up Before Saving To DB. 
UserSchema.statics.signup = async function(email, password){
    
    // validation
    // if (!email || !password) {
    //     throw Error("All Fields must be filled")
    // }
    
    // if (!validator.isEmail(email)) {
    //     throw Error("Email is not valid")
    // }

    // if (!validator.isStrongPassword(password)) {
    //     throw Error("Password not strong enough")
    // }

    const exists = await this.findOne({ email })
    if (exists) {
        throw Error("Email already in use")
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    userDefaultsValues.email = email
    userDefaultsValues.password = hash
    userDefaultsValues.username = "user"

    const user = await this.create(userDefaultsValues)
    console.log(`I am about to save this doc to the db  : ${user}`);

    return user
}

// Function To Encrypt Login Password and Compare With DB Password,
// If User Email Exist In DB
UserSchema.statics.login = async function(email, password){

    // if (!email || !password) {
    //     throw Error("All Fields must be filled")
    // }

    const user = await this.findOne({email})
    if (!user){
        throw Error('Invalid Email Address')
    }
    
    const match = await bcrypt.compare(password, user.password);
    if (!match){
        throw Error('Invalid Password')
    }

    return user
}

const User = mongoose.model('user', UserSchema);

module.exports = User;