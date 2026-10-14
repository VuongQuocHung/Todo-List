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

module.exports.loginPost = async (req, res, next) => {
  try {
    
    const result = await authService.loginUser(req.body);

    res.cookie('token', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    })

    return res.status(200).json({
      data: result.user,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports.me = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.auth.userId);

    res.set('Cache-Control', 'no-store');

    return res.status(200).json({
      data: user
    });
  } catch (error) {
    return next(error);
  }
}

module.exports.logoutPost = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return res.status(204).send();
};
