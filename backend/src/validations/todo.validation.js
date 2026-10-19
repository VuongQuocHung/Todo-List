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
    .nullable()
    .optional(),
  dueDate: z
  .iso.date('Hạn hoàn thành phải là ngày hợp lệ')
  .refine(
    (value) => value >= '1000-01-01',
    'Năm phải từ 1000 trở lên'
  )
  .nullable()
  .optional(),
}).strict();

const updateStatusSchema = z.object({
  completed: z.boolean(),
}).strict();

const updateTodoSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, 'Tiêu đề không được để trống')
      .max(200, 'Tiêu đề không được vượt quá 200 ký tự')
      .optional(),

    description: z
      .string()
      .trim()
      .max(2000, 'Mô tả không được vượt quá 2.000 ký tự')
      .nullable()
      .optional(),

    dueDate: z
      .iso.date('Hạn hoàn thành phải là ngày hợp lệ')
      .refine(
        (value) => value >= '1000-01-01',
        'Năm phải từ 1000 trở lên'
      )
      .nullable()
      .optional(),

    completed: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    'Cần ít nhất một thông tin để cập nhật'
  );

const listQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, 'Trang phải lớn hơn hoặc bằng 1')
    .max(1000000, 'Số trang quá lớn')
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1, 'Mỗi trang phải có ít nhất 1 công việc')
    .max(20, 'Mỗi trang tối đa 20 công việc')
    .default(5),

  keyword: z
    .string()
    .trim()
    .max(100, 'Từ khóa tối đa 100 ký tự')
    .default(''),

  filterTab: z
    .enum(['all', 'pending', 'completed', 'overdue'])
    .default('all'),
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

module.exports.updateTodo = (req, res, next) => {
  const isValidId = /^[1-9]\d{0,19}$/.test(req.params.id);

  if (!isValidId) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'ID công việc không hợp lệ',
      },
    });
  }

  const result = updateTodoSchema.safeParse(req.body);

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

module.exports.getList = (req, res, next) => {
  const result = listQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: result.error.issues[0].message,
      },
    });
  }

  req.validatedQuery  = result.data;
  console.log("chay vao todo validation:\n");
  console.log("req.validatedQuery:", req.validatedQuery);

  next();
};