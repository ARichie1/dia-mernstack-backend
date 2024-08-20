const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcryptjs')

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
UserSchema.pre('save', async function (next){
    console.log(this);
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    console.log(`I am about to save this doc to the db  : ${this}`);
    next();
})

// Function To Encrypt Login Password and Compare With DB Password,
// If User Email Exist In DB
UserSchema.statics.login = async function(email, password){
    const user = await this.findOne({email})
    if (user){
        const auth = await bcrypt.compare(password, user.password);
        if (auth){
            return user;
        }
        throw Error('Invalid Password')
    }
    throw Error('Invalid Email Address')
}

const User = mongoose.model('user', UserSchema);

module.exports = User;