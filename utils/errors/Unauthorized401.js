module.exports = class Unauthorized401 extends Error {
  constructor(message, status) {
    super(message);
    this.statusCode = status;
  }
};
