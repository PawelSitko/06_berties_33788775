// routes/books.js

const express = require('express');
const router = express.Router();

// ------------------------------------
// Task 5: Authorisation Middleware
// ------------------------------------
const redirectLogin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect('../users/login'); 
  }
  next();
};

// ------------------------------------
// LIST ALL BOOKS  (Protected Route)
// ------------------------------------
router.get('/list', redirectLogin, (req, res) => {
  const sqlquery = "SELECT * FROM books";

  db.query(sqlquery, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.send("Database error");
    }

    res.render("list.ejs", { availableBooks: result });
  });
});

// ------------------------------------
// SHOW ADD BOOK PAGE (Protected)
// ------------------------------------
router.get('/addbook', redirectLogin, (req, res) => {
  res.render("addbook.ejs");
});

// ------------------------------------
// HANDLE ADD BOOK FORM (Protected)
// ------------------------------------
router.post('/bookadded', redirectLogin, function (req, res, next) {
  let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
  let newrecord = [req.body.name, req.body.price];

  db.query(sqlquery, newrecord, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send(
        'This book has been added: <br><br>' +
        'Name: ' + req.body.name + '<br>' +
        'Price: ' + req.body.price + '<br><br>' +
        '<a href="./list">Return to book list</a>'
      );
    }
  });
});

// ------------------------------------
// OPTIONAL: Book Search (If you had it before)
// ------------------------------------
router.get('/search', redirectLogin, (req, res) => {
  res.render("booksearch.ejs");
});

router.post('/search-result', redirectLogin, (req, res) => {
  let keyword = req.body.keyword;
  let sqlquery = "SELECT * FROM books WHERE name LIKE ?";

  db.query(sqlquery, ['%' + keyword + '%'], (err, result) => {
    if (err) {
      console.error(err);
      return res.send("Search error");
    }
    res.render("list.ejs", { availableBooks: result });
  });
});

// ------------------------------------
// Export router
// ------------------------------------
module.exports = router;
