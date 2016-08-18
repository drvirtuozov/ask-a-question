import util from 'util';
import http from 'http';

function HttpError(status, message, result) {
  Error.apply(this, arguments);
  Error.captureStackTrace(this, HttpError);
  
  this.status = status;
  this.message = `${http.STATUS_CODES[status]}: ${message}`;
  this.result = result;
  this.json = { ok: false, description: this.message, result };
}

util.inherits(HttpError, Error);

HttpError.prototype.name = "HttpError";

export default HttpError;