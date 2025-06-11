// back-end/src/utils/ApiError.js
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;

    // Capture the exact place the error was created
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
