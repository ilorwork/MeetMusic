const serverResponse = (res, status, message) =>
  res.status(status).json(message).end();

module.exports = serverResponse;
