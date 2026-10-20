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
      date_format(due_date, '%Y-%m-%d') AS dueDate,
      date_format(completed_date, '%Y-%m-%d') as completedDate,
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

module.exports.findTodosByUserId = async (userId, { 
  keyword, 
  filterTab, 
  limit, 
  offset 
}) => {

  const keywordSearch = `%${keyword}%`;

  const conditions = {
    all: '',
    pending: 'and completed = false',
    completed: 'and completed = true',
    overdue: `
      and (
        (completed = false and due_date < date(utc_timestamp() + interval 7 hour))
        or (completed = true and completed_date > due_date)
      )
    `,
  };
  const filterCondition = conditions[filterTab];
  // console.log("filterCondition:", filterCondition);

  // Đếm mỗi tab trên toàn bộ kết quả tìm kiếm, không giới hạn theo trang.
  const stats = {};
  for (const tab of ['all', 'pending', 'completed', 'overdue']) {
    const [countRows] = await pool.execute(
      `select count(*) as total
      from todos
      where user_id = ?
        and title like ?
        ${conditions[tab]}`,
      [userId, keywordSearch]
    );
    stats[tab] = Number(countRows[0].total);
  }
  const totalItems = stats[filterTab];

  // 2. Lấy công việc của trang hiện tại.
  const [rows] = await pool.query(
    `select
      id,
      title,
      description,
      completed,
      date_format(due_date, '%Y-%m-%d') as dueDate,
      date_format(completed_date, '%Y-%m-%d') as completedDate,
      created_at as createdAt,
      updated_at as updatedAt
    from todos
    where user_id = ?
      and title like ?
      ${filterCondition}
    order by created_at desc, id desc
    limit ? offset ?`,
    [userId, keywordSearch, limit, offset]
  );

  const todos = rows.map((todo) => ({
    ...todo,
    completed: Boolean(todo.completed),
  }));

  return {
    todos,
    totalItems,
    stats,
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
    // Xét trạng thái cũ trước khi cập nhật completed.
    setClauses.push(`completed_date = case
      when ? = false then null
      when completed = false then date(utc_timestamp() + interval 7 hour)
      else completed_date
    end`);
    values.push(updates.completed);
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
      date_format(completed_date, '%Y-%m-%d') as completedDate,
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

module.exports.findTodoById = async (userId, todoId) => {
  // Lọc theo cả id và user_id → không bao giờ trả công việc của người khác
  const [rows] = await pool.execute(
    `select
      id,
      title,
      description,
      completed,
      date_format(due_date, '%Y-%m-%d') as dueDate,
      date_format(completed_date, '%Y-%m-%d') as completedDate,
      created_at as createdAt,
      updated_at as updatedAt
    from todos
    where id = ? and user_id = ?`,
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
