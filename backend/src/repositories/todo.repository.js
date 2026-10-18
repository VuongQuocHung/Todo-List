const pool = require('../configs/database.config');

module.exports.createTodo = async (userId, title, description, completed, dueDate) => {
  const [result] = await pool.execute(
    `insert into todos (user_id, title, description, completed, due_date) values (?, ?, ?, ?, ?)`,
    [userId, title, description, completed, dueDate]
  )

  const insertId = result.insertId;

  const [rows] = await pool.execute(
    `select id,
      title,
      description,
      completed,
      DATE_FORMAT(due_date, '%Y-%m-%d') AS dueDate,
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

module.exports.findTodosByUserId = async (userId, keyword) => {
  const keywordSearch = `%${keyword}%`;
  const [rows] = await pool.execute(
    `select id,
      title,
      description,
      completed,
      DATE_FORMAT(due_date, '%Y-%m-%d') AS dueDate,
      created_at AS createdAt,
      updated_at AS updatedAt
    from todos 
    where user_id = ? and title like ?
    order by created_at desc, id desc`,
    [userId, keywordSearch]
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
      DATE_FORMAT(due_date, '%Y-%m-%d') AS dueDate,
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

module.exports.updateTodo = async (userId, todoId, updates) => {
  const setClauses = [];
  const values = [];

  if (updates.title !== undefined) {
    setClauses.push('title = ?');
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    setClauses.push('description = ?');
    values.push(updates.description);
  }
  if (updates.dueDate !== undefined) {
    setClauses.push('due_date = ?');
    values.push(updates.dueDate);
  }
  if (updates.completed !== undefined) {
    setClauses.push('completed = ?');
    values.push(updates.completed);
  }

  if (setClauses.length > 0) {
    values.push(todoId, userId);
    await pool.execute(
      `UPDATE todos
       SET ${setClauses.join(', ')}
       WHERE id = ? AND user_id = ?`,
      values
    );
  }

  const [rows] = await pool.execute(
    `select
      id,
      title,
      description,
      completed,
      DATE_FORMAT(due_date, '%Y-%m-%d') AS dueDate,
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

module.exports.deleteTodo = async (userId, todoId) => {
  const [result] = await pool.execute(
    `delete from todos where id = ? and user_id = ?`,
    [todoId, userId]
  );

  return result.affectedRows;
}