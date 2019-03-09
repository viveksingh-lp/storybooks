const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

const app = express();

// Load Routes
const auth = require('./routes/auth');

// Load Keys
const keys = require('./config/keys');

// Connect to MongoDB
mongoose
    .connect(keys.mongoURI, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB...');
    })
    .catch(err => {
        console.log(err);
    });

// Load User Model
require('./models/User');

// Passport Config
require('./config/passport')(passport);

// Express Session Middleware
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    })
);

// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

// Setting Global Variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Index Route
app.get('/', (req, res) => {
    res.send('It works!');
});

// Use Routes
app.use('/auth', auth);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
