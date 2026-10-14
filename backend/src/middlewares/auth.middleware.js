const jwt = require('jsonwebtoken');

const createUnauthorizedError = () => {
  const error = new Error('Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
  error.statusCode = 401;
  error.code = 'UNAUTHORIZED';

  return error;
};

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.token;

  if(!token){
    return next(createUnauthorizedError());
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch (error) {
    return next(createUnauthorizedError());
  }

  req.auth = {
    userId: payload.id,
  };

  next();
}

