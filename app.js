require('dotenv').config()

const express = require('express');
const morgan = require('morgan');  
const mongoose = require('mongoose');       

// Routes and Route Middleware
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cookie = require('cookie-parser');
const {requireAuth, checkUser} = require('./middleware/authMiddleware');

//The Express App
const app = express();

// Connect To Mongodb Database
// Database Connection Configuration.
const dbUri = process.env.DBURI;
mongoose.connect(dbUri)
    .then( (result) => {
        console.log('Connection successfully made.'); 
        app.listen(process.env.PORT)})
    .catch((err) => console.log('Connection Error', err));

// Register view engine
app.set('view engine', 'ejs');

// Middleware and Static files Express and morgan functions.
// Allow Public Resourses(css, png , ...)
app.use(express.static('public'));

// Encoded Frontend Form Values
app.use(express.urlencoded({extented: true}));
app.use(express.json());

// Enable Easy Use Of Cookies
app.use(cookie());

// Developer Feedback In Console
app.use(morgan('dev'));

// Page Routing

// Check Log In user
app.get('*', checkUser);

// Home Page Route
app.get('/', (req, res) => {
    res.render('index', {title: "Home"});
});

// Auth Routes
app.use(authRoutes);

// User Routes
app.use(userRoutes);

// About Page
app.get('/about', requireAuth, (req, res) => {
    res.render('about', {title: "About Us"});
});

// 404  Page
app.use((req, res) => {
    res.status(404).render('404', {title: "404"});
});