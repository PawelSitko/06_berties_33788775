//routes/main.js
const express = require("express");
const router = express.Router();

//Home page
router.get("/", (req, res) => {
  res.render("index.ejs", { shopData: req.app.locals.shopData });
});

//About page
router.get("/about", (req, res) => {
  res.render("about.ejs", { shopData: req.app.locals.shopData });
});

module.exports = router;
