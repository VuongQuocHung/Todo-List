const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const todoController = require('../controllers/todo.controller');
const todoValidation = require('../validations/todo.validation');

router.post('/', authMiddleware.requireAuth, todoValidation.createPost, todoController.createPost);

router.patch('/:id', authMiddleware.requireAuth, todoValidation.updateTodo, todoController.updateTodo);

router.delete(
  '/:id',
  authMiddleware.requireAuth,
  todoValidation.deleteTodo,
  todoController.deleteTodo
);

router.get(
  '/',
  authMiddleware.requireAuth,
  todoValidation.getList,
  todoController.getList
);

module.exports = router;