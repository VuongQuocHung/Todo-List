const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user.repository');

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
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedFullname = fullname?.trim() || null;
  const normalizedEmail = email.trim().toLowerCase();

  const existingUsername = await userRepository.findUserByUsername(
    normalizedUsername
  );

  if (existingUsername) {
    throw createUsernameExistsError();
  }

  const existingUser = await userRepository.findUserByEmail(
    normalizedEmail
  );

  if (existingUser) {
    throw createEmailExistsError();
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  try {
    return await userRepository.createUser(
      normalizedUsername,
      normalizedFullname,
      normalizedEmail,
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

