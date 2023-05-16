class BadReqErr extends Error {
  constructor(mess) {
    super(mess);
    this.statusCode = 400;
  }
}

module.exports = BadReqErr;
