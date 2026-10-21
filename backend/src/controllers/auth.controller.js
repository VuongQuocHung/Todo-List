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

module.exports.logoutPost = async (req, res, next) => {
  try {
    await authService.logoutUser(req.cookies.token);
  } catch (error) {
    // Redis lỗi → vẫn xóa cookie cho người dùng, nhưng ghi log để biết token chưa bị thu hồi
    console.error('[auth] không thu hồi được token:', error.message);
  }

  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return res.status(204).send();
};
