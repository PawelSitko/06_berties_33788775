// routes/users.js
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const { check, validationResult } = require("express-validator");


// ------------------------------
// REDIRECT LOGIN MIDDLEWARE
// ------------------------------
const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("./login");
  }
  next();
};


// ------------------------------
// SHOW REGISTER PAGE
// ------------------------------
router.get("/register", (req, res) => {
  res.render("register.ejs", { errors: [] });
});


// ------------------------------
// HANDLE REGISTRATION
// ------------------------------
router.post(
  "/registered",
  [
    // VALIDATION RULES
    check("email").isEmail().withMessage("Enter a valid email"),

    check("username")
      .isLength({ min: 3, max: 20 })
      .withMessage("Username must be 3–20 characters"),

    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"), // allows "smiths"
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Show errors on the register page
      return res.render("register.ejs", { errors: errors.array() });
    }

    // SANITISE INPUTS
    const first = req.sanitize(req.body.first);
    const last = req.sanitize(req.body.last);
    const email = req.sanitize(req.body.email);
    const username = req.sanitize(req.body.username);
    const plainPassword = req.body.password;

    // HASH PASSWORD
    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
      if (err) return next(err);

      let sqlquery =
        "INSERT INTO users (first, last, email, username, password) VALUES (?, ?, ?, ?, ?)";

      let newUser = [first, last, email, username, hashedPassword];

      db.query(sqlquery, newUser, function (err, result) {
        if (err) return next(err);

        res.send(
          `Hello ${first} ${last}, you are now registered! We will contact you at ${email}.`
        );
      });
    });
  }
);


// ------------------------------
// SHOW LOGIN PAGE
// ------------------------------
router.get("/login", (req, res) => {
  res.render("login.ejs", { loginError: "" });
});


// ------------------------------
// HANDLE LOGIN
// ------------------------------
router.post("/loggedin", (req, res, next) => {
  const username = req.body.username;
  const plainPassword = req.body.password;

  let sqlquery = "SELECT * FROM users WHERE username = ?";

  db.query(sqlquery, [username], (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return res.render("login.ejs", {
        loginError: "Invalid username or password",
      });
    }

    const user = results[0];

    bcrypt.compare(plainPassword, user.password, (err, match) => {
      if (err) return next(err);

      if (!match) {
        return res.render("login.ejs", {
          loginError: "Invalid username or password",
        });
      }

      // Save login session
      req.session.userId = user.id;
      req.session.username = user.username;

      res.send(
        `You are now logged in as ${username}.<br><a href="../books/list">Go to book list</a>`
      );
    });
  });
});


// ------------------------------
// LOGOUT
// ------------------------------
router.get("/logout", redirectLogin, (req, res) => {
  req.session.destroy(() => {
    res.redirect("/users/login");
  });
});


// Export router
module.exports = router;
