"use strict";

const util = require("util");
const http = require("http");

function HttpError(status, message) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, HttpError);
  
  this.status = status;
  this.message = http.STATUS_CODES[status] + ": " + message;
}

util.inherits(HttpError, Error);

HttpError.prototype.name = "HttpError";

module.exports = HttpError;