module.exports = class AccessDeniedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
};
