function validateContentType(req, res, next) {
  const isJsonRequest = req.is('application/json');

  if ((req.method === 'POST' || req.method === 'PUT') && !isJsonRequest) {
    return res.status(415).json({
      error: 'Content-Type must be application/json',
    });
  }

  next();
}

module.exports = validateContentType;
