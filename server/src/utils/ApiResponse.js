/**
 * Standard API response wrapper
 */
class ApiResponse {
  constructor(statusCode, data, message = 'Success', meta = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }
}

/**
 * Send a success response
 */
const sendSuccess = (res, data, message = 'Success', statusCode = 200, meta = null) => {
  const response = new ApiResponse(statusCode, data, message, meta);
  return res.status(statusCode).json(response);
};

/**
 * Send a created response
 */
const sendCreated = (res, data, message = 'Created successfully') => {
  return sendSuccess(res, data, message, 201);
};

module.exports = { ApiResponse, sendSuccess, sendCreated };
