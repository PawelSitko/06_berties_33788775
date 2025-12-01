// routes/users.js

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;

// Protect routes (used for logout etc.)
const redirectLogin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect("./login");
  }
  next();
};

// ===============================
// SHOW REGISTRATION PAGE
// ===============================
router.get("/register", (req, res) => {
  res.render("register.ejs");
});

// ===============================
// HANDLE REGISTRATION
// ===============================
router.post("/registered", (req, res, next) => {
  const plainPassword = req.body.password;

  // Debug check (optional while testing)
  console.log("Register – plainPassword:", plainPassword);

  bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
    if (err) return next(err);

    const sqlquery =
      "INSERT INTO users (first, last, email, username, password) VALUES (?, ?, ?, ?, ?)";

    const newUser = [
      req.body.first,
      req.body.last,
      req.body.email,
      req.body.username,
      hashedPassword,
    ];

    db.query(sqlquery, newUser, (err, result) => {
      if (err) return next(err);

      res.send(
        "Hello " +
          req.body.first +
          " " +
          req.body.last +
          "! You are now registered. We will email you at " +
          req.body.email +
          '<br><br><a href="./login">Click here to log in</a>'
      );
    });
  });
});

// ===============================
// SHOW LOGIN PAGE
// ===============================
router.get("/login", (req, res) => {
  res.render("login.ejs");
});

// ===============================
// HANDLE LOGIN
// ===============================
router.post("/loggedin", (req, res, next) => {
  const username = req.body.username;
  const plainPassword = req.body.password;

  console.log("Login – username:", username);
  console.log("Login – plainPassword:", plainPassword);

  const sqlquery = "SELECT * FROM users WHERE username = ?";

  db.query(sqlquery, [username], (err, results) => {
    if (err) return next(err);

    if (results.length === 0) {
      return res.send("Login failed: username not found.");
    }

    const user = results[0];

    console.log("DB stored hash:", user.password);

    bcrypt.compare(plainPassword, user.password, (err, match) => {
      if (err) return next(err);

      console.log("Password match?", match);

      if (!match) {
        return res.send("Login failed: incorrect password.");
      }

      req.session.userId = user.username;

      res.send(
        "You are now logged in as " +
          user.username +
          '<br><a href="../books/list">Go to book list</a>'
      );
    });
  });
});

// ===============================
// LOGOUT
// ===============================
router.get("/logout", redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("./");
    }
    res.send(
      "You are now logged out.<br><a href='./login'>Login again</a>"
    );
  });
});

module.exports = router;
