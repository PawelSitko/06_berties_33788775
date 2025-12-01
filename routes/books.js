// routes/books.js
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator"); // ✅ for validation

// Middleware: only allow access if logged in
const redirectLogin = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.redirect("/users/login");
  }
  next();
};


router.get("/list", redirectLogin, (req, res, next) => {
  const sqlquery = "SELECT * FROM books";

  db.query(sqlquery, (err, result) => {
    if (err) {
      return next(err);
    }
    res.render("list.ejs", { availableBooks: result });
  });
});


router.get("/addbook", redirectLogin, (req, res) => {
  // send empty errors and blank default values
  res.render("addbook.ejs", { errors: [], old: {} });
});


router.post(
  "/bookadded",
  redirectLogin,
  [
    // Validate name
    check("name")
      .trim()
      .notEmpty()
      .withMessage("Book name is required"),

    // Validate price
    check("price")
      .notEmpty()
      .withMessage("Price is required")
      .bail()
      .isFloat({ min: 0 })
      .withMessage("Price must be a number greater than or equal to 0"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);

    // Keep raw values for redisplay
    const oldValues = {
      name: req.body.name,
      price: req.body.price,
    };

    if (!errors.isEmpty()) {
      // If validation fails, show form again with errors + old input
      return res.render("addbook.ejs", {
        errors: errors.array(),
        old: oldValues,
      });
    }

    // If validation passed, sanitise and insert into DB
    const name = req.sanitize(req.body.name);
    const price = parseFloat(req.body.price);

    const sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";
    const newrecord = [name, price];

    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return next(err);
      }

      res.send(
        "This book has been added: <br><br>" +
          "Name: " +
          name +
          "<br>" +
          "Price: " +
          price +
          '<br><br><a href="./list">Back to book list</a>'
      );
    });
  }
);


// SHOW SEARCH FORM (protected)
// GET /books/search


router.get("/search", redirectLogin, (req, res) => {
  res.render("search.ejs");
});

router.get("/search-result", redirectLogin, (req, res, next) => {
  let keyword = req.query.keyword || "";
  keyword = req.sanitize(keyword);

  const sqlquery = "SELECT * FROM books WHERE name LIKE ?";
  const searchTerm = "%" + keyword + "%";

  db.query(sqlquery, [searchTerm], (err, result) => {
    if (err) {
      return next(err);
    }

    res.render("list.ejs", { availableBooks: result });
  });
});

module.exports = router;
