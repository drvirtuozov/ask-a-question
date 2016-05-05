"use strict";

const mongoose = require("mongoose");

let counterSchema = mongoose.Schema({
    _id: String,
    count: Number
});

module.exports = mongoose.model("Counter", counterSchema);