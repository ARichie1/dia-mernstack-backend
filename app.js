require('dotenv').config()

const express = require('express');
const morgan = require('morgan');  
const mongoose = require('mongoose');

const http = require("http")
const socketio = require("socket.io")

// Routes and Route Middleware
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cookie = require('cookie-parser');
const {requireAuth} = require('./middleware/authMiddleware');
const { log } = require('console');

const cors = require("cors")

//The Express App
const app = express();

const server = http.createServer(app)
const io = socketio(server, { 
            cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        }
    }
)
const logic = require("./game/logic")

// Connect To Mongodb Database
// Database Connection Configuration.
const dbUri = process.env.DBURI;
mongoose.connect(dbUri)
    .then( (result) => {
        console.log('Connection to database successfully made.'); 
        // app.listen(process.env.PORT)
        // server.listen(process.env.PORT || 4000)
        
        })
    .catch((err) => console.log('Connection Error', err));



// app.listen(process.env.PORT)
server.listen(process.env.PORT || 4000)
console.log('server started...'); 

// Register view engine
app.set('view engine', 'ejs');

// Middleware and Static files Express and morgan functions.
// Allow Public Resourses(css, png , ...)
// app.use(express.static('public'));

// Encoded Frontend Form Values
app.use(express.urlencoded({extented: true}));
app.use(express.json());

// Enable Easy Use Of Cookies
app.use(cookie());

// Developer Feedback In Console
app.use(morgan('dev'));

app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL,
    })
);

// Page Routing
// Home Page Route
app.get('/', (req, res) => {
    // res.render('index', {title: "Home"});
    res.json({title: "Home"});
});

// Auth Routes
app.use("/api/auth/user", authRoutes);

// User Routes
app.use("/api/data", userRoutes);

// About Page
app.get('/about', requireAuth, (req, res) => {
    res.json({title: "About Us"});
});

// 404  Page
app.use((req, res) => {
    res.status(404).json({title: "404"});
});

io.on('connection', client => {
    console.log('Socket IO Connection successfully made.'); 
    console.log(client.id);
    
    logic.initializeGame(io, client)
})