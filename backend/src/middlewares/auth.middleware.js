const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../repositories/token-blacklist.repository');

const createUnauthorizedError = () => {
  const error = new Error('Phiên đăng nhập không hợp lệ hoặc đã hết hạn');
  error.statusCode = 401;
  error.code = 'UNAUTHORIZED';

  return error;
};

module.exports.requireAuth = async (req, res, next) => {
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

  try {
    // Token đã đăng xuất (bị thu hồi) thì từ chối dù chữ ký vẫn đúng
    if (payload.jti && await tokenBlacklist.has(payload.jti)) {
      return next(createUnauthorizedError());
    }
  } catch (error) {
    return next(error);
  }

  req.auth = {
    userId: payload.id,
  };

  next();
}

