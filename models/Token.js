"use strict";

const mongoose = require("mongoose");

let tokenSchema = mongoose.Schema({
    user: Number
});

module.exports = mongoose.model("Token", tokenSchema);