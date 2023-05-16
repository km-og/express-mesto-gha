class ConflictErr extends Error {
  constructor(mess) {
    super(mess);
    this.statusCode = 409;
  }
}

module.exports = ConflictErr;
