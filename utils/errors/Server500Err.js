module.exports = class Server500Err extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
};
