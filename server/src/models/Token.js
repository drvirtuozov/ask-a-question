"use strict";

const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({
  user: Number
});

module.exports = mongoose.model("Token", tokenSchema);