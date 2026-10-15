const express = require('express');
const cookieParser = require('cookie-parser');

const pool = require('./configs/database.config');
const authRoutes = require('./routes/auth.route');
const todoRoutes = require('./routes/todo.route');

const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/api/health', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      database: 'connected',
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorMiddleware.notFoundHandler);
app.use(errorMiddleware.errorHandler);

module.exports = app;
