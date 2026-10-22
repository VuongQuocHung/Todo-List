const authService = require('../services/auth.service');

// Cookie chỉ gửi qua HTTPS khi COOKIE_SECURE=true.
// Không đặt biến này → production bật, dev tắt. Chạy qua IP LAN chưa có HTTPS thì đặt COOKIE_SECURE=false
const isSecureCookie = process.env.COOKIE_SECURE
  ? process.env.COOKIE_SECURE === 'true'
  : process.env.NODE_ENV === 'production';

// Dùng chung cho cookie() và clearCookie() — lệch option thì trình duyệt không xóa được cookie
const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: isSecureCookie,
  path: '/',
};

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
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
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

  res.clearCookie('token', cookieOptions);

  return res.status(204).send();
};
