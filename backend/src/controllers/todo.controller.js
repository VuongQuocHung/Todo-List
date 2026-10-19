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
    // console.log("Chay vao controller getList");
    // console.log(req.auth);
    // console.log(req.keywordSearch);

    const userId = req.auth.userId;
    const validatedQuery = req.validatedQuery;

    const result  = await todoService.getTodos(userId, validatedQuery);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports.updateTodo = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const todoId = req.params.id;

    const todo = await todoService.updateTodo(userId, todoId, req.body);

    return res.status(200).json({
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.deleteTodo = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const todoId = req.params.id;
    await todoService.deleteTodo(userId, todoId);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};