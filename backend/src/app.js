import express from 'express';
import pool from './configs/database.config.js';

const app = express();

app.use(express.json());

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

export default app;