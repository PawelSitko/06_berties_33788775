//routes/users.js

const express = require("express");
const router = express.Router();

//Password hashing
const bcrypt = require("bcrypt");
const saltRounds = 10;

//Validation
const { check, validationResult } = require("express-validator");

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("./login");
  }
  next();
};

//Show registration form
router.get("/register", (req, res) => {
  res.render("register.ejs", { errors: [] });
});

//Handling registration form
router.post(
  "/registered",
  [
    //Email must look like an email
    check("email").isEmail().withMessage("Please enter a valid email address"),
    //Username 5–20 chars
    check("username")
      .isLength({ min: 5, max: 20 })
      .withMessage("Username must be between 5 and 20 characters"),
    //Password at least 8 chars
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      //If validation fails, re-show the form
      return res.render("register.ejs", { errors: errors.array() });
    }

    //Sanitise inputs to protect from XSS
    const first = req.sanitize(req.body.first);
    const last = req.sanitize(req.body.last);
    const email = req.sanitize(req.body.email);
    const username = req.sanitize(req.body.username);
    const plainPassword = req.body.password; 

    //Hash the password before saving
    bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
      if (err) return next(err);

      const sqlquery =
        "INSERT INTO users (first, last, email, username, password) VALUES (?, ?, ?, ?, ?)";

      const newUser = [first, last, email, username, hashedPassword];

      db.query(sqlquery, newUser, (err, result) => {
        if (err) return next(err);

        res.send(
          "Hello " +
            first +
            " " +
            last +
            "! You are now registered. We will email you at " +
            email
        );
      });
    });
  }
);

//Show login page
router.get("/login", (req, res) => {
  res.render("login.ejs");
});

//Login Handle
router.post("/loggedin", (req, res, next) => {
  const username = req.body.username;
  const plainPassword = req.body.password;

  const sqlquery = "SELECT * FROM users WHERE username = ?";

  db.query(sqlquery, [username], (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return res.send("Login failed: username not found.");
    }

    const user = results[0];

    bcrypt.compare(plainPassword, user.password, (err, match) => {
      if (err) return next(err);

      if (!match) {
        return res.send("Login failed: incorrect password.");
      }

      //Save session id
      req.session.userId = user.id;

      res.send(
        "You are now logged in as " +
          username +
          '.<br><a href="../books/list">Go to book list</a>'
      );
    });
  });
});

//Log out
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("../");
  });
});

module.exports = router;
