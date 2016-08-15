import util from 'util';
import http from 'http';

function HttpError(status, message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);
    
    this.status = status;
    this.message = `${http.STATUS_CODES[status]}: ${message}`;
}

util.inherits(HttpError, Error);

HttpError.prototype.name = "HttpError";

export default HttpError;