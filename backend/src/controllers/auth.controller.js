const authService = require('../services/auth.service');

module.exports.registerPost = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    return res.status(201).json({
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

