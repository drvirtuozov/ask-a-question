var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
    res.render("index");
});

router.get("/questions", function(req, res, next) {
    res.render("index");
});

router.get("/user/:username", function(req, res, next) {
    res.render("index");
});

module.exports = router;
