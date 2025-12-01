// index.js

// Core modules and libraries
var mysql = require('mysql2');
var express = require('express');
var ejs = require('ejs');
const path = require('path');
const session = require('express-session');

// Create the express application
const app = express();
const port = 8000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Parse form data from POST requests
app.use(express.urlencoded({ extended: true }));

// Enable session support (Lab 8a Task 2)
app.use(session({
    secret: 'cookies', 
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 600000 }  // session expires after 10 minutes
}));

// Make session available in all EJS views as "session"
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Serve static files (CSS, client-side JS, images) from /public
app.use(express.static(path.join(__dirname, 'public')));

// Application-level data (available in all views as shopData)
app.locals.shopData = { shopName: "Bertie's Books" };

// Set up the MySQL connection pool
const db = mysql.createPool({
    host: 'localhost',
    user: 'berties_books_app',
    password: 'qwertyuiop',
    database: 'berties_books',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;  // so routes can use db directly

// Load route handlers
const mainRoutes = require('./routes/main');
app.use('/', mainRoutes);

const usersRoutes = require('./routes/users');
app.use('/users', usersRoutes);

const booksRoutes = require('./routes/books');
app.use('/books', booksRoutes);

// Start the web server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});
