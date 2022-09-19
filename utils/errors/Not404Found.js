module.exports = class Not404Found extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
};
