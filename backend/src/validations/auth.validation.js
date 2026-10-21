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
    .optional()
    .nullable()
    .transform((value) => value || null), // '', undefined, null → đều lưu là null

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
    .max(255, 'Email không được vượt quá 255 ký tự'),

  password: z
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .max(72, 'Mật khẩu không được vượt quá 72 ký tự')
    .refine((value) => Buffer.byteLength(value, 'utf8') <= 72,
      'Mật khẩu quá dài, vui lòng rút ngắn (chữ có dấu chiếm nhiều dung lượng hơn)'
    ), // bcrypt chỉ dùng 72 BYTE đầu, chữ có dấu chiếm 2–3 byte
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
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: result.error.issues[0].message,
      },
    });
    return res;
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

