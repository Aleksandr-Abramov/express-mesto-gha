module.exports = class Http409Conflicting extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
