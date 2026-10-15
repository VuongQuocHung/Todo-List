const { z } = require('zod');

const createSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Tiêu đề không được để trống')
    .max(200, 'Tiêu đề không được vượt quá 200 ký tự'),

  description: z
    .string()
    .trim()
    .max(2000, 'Mô tả không được vượt quá 2.000 ký tự')
    .optional(),
}).strict();

const updateStatusSchema = z.object({
  completed: z.boolean(),
}).strict();

module.exports.updateStatus = (req, res, next) => {
  const isValidId = /^[1-9]\d{0,19}$/.test(req.params.id);

  if (!isValidId) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'ID công việc không hợp lệ',
      },
    });
  }

  const result = updateStatusSchema.safeParse(req.body);

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

module.exports.createPost = (req, res, next) => {
  const result = createSchema.safeParse(req.body);
  console.log(result);
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

module.exports.deleteTodo = (req, res, next) => {
  if (!/^[1-9]\d{0,19}$/.test(req.params.id)) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'ID công việc không hợp lệ',
      },
    });
  }
  next();
};