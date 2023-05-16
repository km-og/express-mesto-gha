class NotFoundErr extends Error {
  constructor(mess) {
    super(mess);
    this.statusCode = 404;
  }
}

module.exports = NotFoundErr;
