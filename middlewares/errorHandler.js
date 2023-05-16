const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const mess = statusCode === 500 ? "На сервере произошла ошибка" : err.mess;
  res.status(statusCode).send({ mess });

  next();
};

module.exports = errorHandler;
