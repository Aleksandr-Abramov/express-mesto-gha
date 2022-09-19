module.exports = class Http200Ok extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 200;
  }
};
