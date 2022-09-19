module.exports = class Bad400Request extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
};
