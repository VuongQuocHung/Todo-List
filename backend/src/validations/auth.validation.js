// Quy tắc dữ liệu của chức năng auth
const { z } = require('zod');

const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username phải có ít nhất 3 ký tự')
    .max(50, 'Username không được vượt quá 50 ký tự')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username chỉ được chứa chữ cái, số và dấu gạch dưới'
    ),

  fullname: z
    .string()
    .trim()
    .max(100, 'Họ tên không được vượt quá 100 ký tự')
    .optional(),

  email: z
    .string()
    .trim()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
    .max(255, 'Email không được vượt quá 255 ký tự'),

  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(72, 'Mật khẩu không được vượt quá 72 ký tự'),
});

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),

  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
});

module.exports.registerPost = (req, res, next) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: result.error.issues[0].message,
      },
    });
  }

  req.body = result.data;
  next();
};

module.exports.loginPost = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: result.error.issues[0].message,
      },
    });
  }

  req.body = result.data;
  next();
};

