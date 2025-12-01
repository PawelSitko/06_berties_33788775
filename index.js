//index.js
require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const mysql = require("mysql2");
const expressSanitizer = require("express-sanitizer");

const port = 8000;

//1. VIEW ENGINE
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(expressSanitizer());

//4. STATIC FILES
app.use(express.static(path.join(__dirname, "public")));


//5. SESSIONS
app.use(
  session({
    secret: "change-this-secret",
    resave: false,
    saveUninitialized: false,
  })
);

//Make session available inside ALL EJS views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "berties_books",
});

global.db = db;


app.locals.shopData = { shopName: "Bertie's Books" };


//7. ROUTES
const mainRoutes = require("./routes/main");
app.use("/", mainRoutes);

const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

const booksRoutes = require("./routes/books");
app.use("/books", booksRoutes);


app.listen(port, () => {
  console.log(`Bertie's Books app running on port ${port}`);
});
