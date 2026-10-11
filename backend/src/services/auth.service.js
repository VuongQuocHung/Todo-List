const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/user.repository');

const createEmailExistsError = () => {
  const error = new Error('Email đã được đăng ký');
  error.statusCode = 409;
  error.code = 'EMAIL_ALREADY_EXISTS';

  return error;
};

module.exports.registerUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
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
      normalizedEmail,
      passwordHash
    );
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createEmailExistsError();
    }

    throw error;
  }
};

