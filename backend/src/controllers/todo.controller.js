const todoService = require('../services/todo.service');

module.exports.createPost = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const todo = await todoService.createPost(userId, req.body);

    return res.status(201).json({
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};
