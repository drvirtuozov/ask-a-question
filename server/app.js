"use strict";

const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const expressJWT = require("express-jwt");
const jwt = require("jsonwebtoken");

const config = require("../config");

const mongoose = require("mongoose");
mongoose.connect("mongodb://admin:admin@ds011168.mongolab.com:11168/ask-a-question");

const HttpError = require("./error/http");

const app = express();

  
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("we're connected!");
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.set("env", "development");

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let auth = expressJWT({
  secret: config.secret,
  getToken: req => { return req.body.token || req.query.token || req.headers["x-access-token"] }
});

app.use("/", require("./routes/index"));
app.use("/api/login", require("./routes/api/login"));
app.use("/api/questions", require("./routes/api/questions"));
app.use("/api/answers", require("./routes/api/answers"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/comment", require("./routes/api/comment"));
app.use("/api/like", auth, require("./routes/api/like"));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler

app.use((err, req, res, next) => {
  if (typeof err == "number") {
    err = new HttpError(err);
  }
  
  res.status(err.status || 500);
  res.render("error", {
    status: err.status,
    message: err.message,
    error: app.get("env") === "development" ? err : {}
  });
});

app.listen(config.port, () => {
  console.log("Server is listening on localhost:" + config.port);
});


module.exports = app;
