import http from 'http';


export default class HttpError extends Error {
  constructor(status = 500, message = "Unknown error", result = {}) {
    super();
    this.name = "HttpError";
    this.status = status;
    this.message = `${http.STATUS_CODES[status]}: ${message}`;
    this.result = result;
    this.json = { ok: false, description: this.message, result };
  }
}