const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const todoController = require('../controllers/todo.controller');
const todoValidation = require('../validations/todo.validation');

router.post('/', authMiddleware.requireAuth, todoValidation.createPost, todoController.createPost);

router.get('/', authMiddleware.requireAuth, todoController.getList);

router.patch(
  '/:id',
  authMiddleware.requireAuth,
  todoController.updateStatus
);

module.exports = router;