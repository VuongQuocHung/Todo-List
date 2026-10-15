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

module.exports.getList = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const todos = await todoService.getTodos(userId);

    return res.status(200).json({
      data: todos,
    })
  } catch (error) {
    next(error);
  }
};
