import util from 'util';
import http from 'http';

function HttpError(status, message, params) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);
    
    this.status = status;
    this.message = `${http.STATUS_CODES[status]}: ${message}`;
    this.params = params;
}

util.inherits(HttpError, Error);

HttpError.prototype.name = "HttpError";

export default HttpError;