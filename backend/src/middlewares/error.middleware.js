module.exports.notFoundHandler = (req, res, next) => {
  return res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'Endpoint không tồn tại',
    },
  });
};

module.exports.errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode ?? error.status ?? 500;
  const isServerError = statusCode >= 500;

  if (isServerError) {
    console.error(error);
  }

  return res.status(statusCode).json({
    error: {
      code:
        error.code ??
        (isServerError
          ? 'INTERNAL_SERVER_ERROR'
          : 'REQUEST_ERROR'),
      message: isServerError
        ? 'Đã xảy ra lỗi, vui lòng thử lại sau'
        : error.message,
    },
  });
};

