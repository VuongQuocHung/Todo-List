const userRepository = require('../repositories/user.repository');
const todoRepository = require('../repositories/todo.repository');
const todoCache = require('../caches/todo.cache');
const { withCache } = require('../caches/cache');

module.exports.createPost = async (userId, { title, description, dueDate }) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    const error = new Error('Vui lòng đăng nhập lại');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';

    throw error;
  }

  const todo = await todoRepository.createTodo(
    userId, 
    title, 
    description || null, 
    false,
    dueDate || null
  );

  await todoCache.invalidateTodoLists(userId); // có công việc mới → danh sách cũ không còn đúng

  return todo;
};

// ===== Hàm tính toán "thuần" — chỉ đọc database, không biết gì về cache =====
const buildTodoPage = async (userId, { page, limit, keyword, filterTab }) => {
  const offset = (page - 1) * limit;

  const result = await todoRepository.findTodosByUserId(userId, {
    keyword,
    filterTab,
    limit,
    offset,
  });

  return {
    data: result.todos,
    pagination: {
      page,
      limit,
      totalItems: result.totalItems,
      totalPages: Math.ceil(result.totalItems / limit),
    },
    stats: result.stats,
  };
};

// ===== Gắn cache vào hàm tính toán (giống function_cached(fibo)) =====
const findTodoByIdCached = withCache(todoRepository.findTodoById, {
  buildKey: todoCache.buildTodoKey,
});

const buildTodoPageCached = withCache(buildTodoPage, {
  buildKey: todoCache.buildListKey,
});

module.exports.getTodos = (userId, query) => buildTodoPageCached(userId, query);

module.exports.getTodoById = async (userId, todoId) => {
  const todo = await findTodoByIdCached(userId, todoId);

  if (!todo) {
    // Không tìm thấy → withCache đã không lưu null vào cache
    const error = new Error('Không tìm thấy công việc');
    error.statusCode = 404;
    error.code = 'TODO_NOT_FOUND';
    throw error;
  }

  return todo;
};


module.exports.updateTodo = async (userId, todoId, updateData) => {
  const todo = await todoRepository.updateTodo(userId, todoId, updateData);

  if (!todo) {
    const error = new Error('Công việc không tìm thấy');
    error.statusCode = 404;
    error.code = 'TODO_NOT_FOUND';
    throw error;
  }

  // Dữ liệu đã đổi → xóa bản cũ trong cache
  await todoCache.invalidateTodo(userId, todoId);
  await todoCache.invalidateTodoLists(userId);

  return todo;
};

module.exports.deleteTodo = async (userId, todoId) => {
  const deletedRecord = await todoRepository.deleteTodo(userId, todoId);

  if(deletedRecord === 0){
    const error = new Error('Không tìm thấy công việc');
    error.statusCode = 404;
    error.code = 'TODO_NOT_FOUND';
    
    throw error;
  }

  // Công việc đã bị xóa → xóa luôn cache để lần đọc sau trả 404
  await todoCache.invalidateTodo(userId, todoId);
  await todoCache.invalidateTodoLists(userId);
}


