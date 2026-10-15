const pool = require('../configs/database.config');

module.exports.createTodo = async (userId, title, description, completed) => {
  const [result] = await pool.execute(
    `insert into todos (user_id, title, description, completed) values (?, ?, ?, ?)`,
    [userId, title, description, completed]
  )

  const insertId = result.insertId;

  const [rows] = await pool.execute(
    `select id,
      title,
      description,
      completed,
      created_at AS createdAt,
      updated_at AS updatedAt
    from todos 
    where id = ? and user_id = ?`,
    [insertId, userId]
  );

  const todo = rows[0];

  return {
    ...todo,
    completed: Boolean(todo.completed),
  }
}

module.exports.findTodosByUserId = async (userId) => {
  const [rows] = await pool.execute(
    `select id,
      title,
      description,
      completed,
      created_at AS createdAt,
      updated_at AS updatedAt
    from todos 
    where user_id = ?
    order by created_at desc, id desc`,
    [userId]
  );
  
  return rows.map((todo) => ({
    ...todo,
    completed: Boolean(todo.completed),
  }));
}

module.exports.updateStatus = async (userId, todoId, completed) => {
  await pool.execute(
    `UPDATE todos
    SET completed = ?
    WHERE id = ? AND user_id = ?`,
    [completed, todoId, userId]
  );

  const [rows] = await pool.execute(
    `select
      id,
      title,
      description,
      completed,
      created_at as createdAt,
      updated_at as updatedAt
    from todos
    where id = ? and user_id = ?
    `,
    [todoId, userId]
  );

  const todo = rows[0];

  if (!todo) {
    return null;
  }

  return {
    ...todo,
    completed: Boolean(todo.completed),
  };
};