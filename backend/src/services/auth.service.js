const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');
const crypto = require('crypto');
const tokenBlacklist = require('../repositories/token-blacklist.repository');

// Lỗi khi đăng ký
const createEmailExistsError = () => {
  const error = new Error('Email đã được đăng ký');
  error.statusCode = 409;
  error.code = 'EMAIL_ALREADY_EXISTS';

  return error;
};

const createUsernameExistsError = () => {
  const error = new Error('Username đã được sử dụng');
  error.statusCode = 409;
  error.code = 'USERNAME_ALREADY_EXISTS';

  return error;
};

// Lỗi khi đăng nhập
const createInvalidCredentialsError = () => {
  const error = new Error(
    'Email hoặc mật khẩu không đúng'
  );

  error.statusCode = 401;
  error.code = 'INVALID_CREDENTIALS';

  return error;
};

module.exports.registerUser = async ({
  username,
  fullname,
  email,
  password,
}) => {

  const existingUsername = await userRepository.findUserByUsername(username);

  if (existingUsername) {
    throw createUsernameExistsError();
  }

  const existingUser = await userRepository.findUserByEmail(email);

  if (existingUser) {
    throw createEmailExistsError();
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    return await userRepository.createUser(
      username,
      fullname,
      email,
      passwordHash
    );
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('uq_users_username')) {
        throw createUsernameExistsError();
      }

      throw createEmailExistsError();
    }

    throw error;
  }
};

module.exports.loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existUser = await userRepository.findUserForLogin(normalizedEmail);

  if (!existUser) {
    throw createInvalidCredentialsError();
  }

  const isPasswordValid = await bcrypt.compare(password, existUser.passwordHash);

  if(!isPasswordValid){
    throw createInvalidCredentialsError();
  }

  // tạo chuỗi bảo mật jwt
  const token = jwt.sign(
    {
      id: existUser.id,
      email: existUser.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
      jwtid: crypto.randomUUID(), // mã riêng của token, dùng để thu hồi khi đăng xuất
    }
  );

  return {
    token,
    user: {
      id: existUser.id,
      username: existUser.username,
      fullname: existUser.fullname,
      email: existUser.email,
      createdAt: existUser.createdAt,
    },
  };
}

module.exports.getCurrentUser = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    const error = new Error('Bạn chưa đăng nhập');

    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';

    throw error;
  }

  return user;
};


module.exports.logoutUser = async (token) => {
  if (!token) return;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch (error) {
    return; // token sai / đã hết hạn thì không cần thu hồi
  }

  // Token cũ (tạo trước khi có jti) thì không thu hồi được, chỉ chờ hết hạn
  if (!payload.jti) return;

  // Chỉ cần nằm trong danh sách đen đến lúc token tự hết hạn
  const ttlSeconds = payload.exp - Math.floor(Date.now() / 1000);

  if (ttlSeconds > 0) {
    await tokenBlacklist.add(payload.jti, ttlSeconds);
  }
};
