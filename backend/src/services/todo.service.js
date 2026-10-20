const userRepository = require('../repositories/user.repository');
const todoRepository = require('../repositories/todo.repository');
const todoCache = require('../caches/todo.cache');

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

  await todoCache.bumpListVersion(userId); // có công việc mới → danh sách cũ không còn đúng

  return todo;


  return todo;
};

module.exports.getTodos = async (userId, { page, limit, keyword, filterTab }) => {
  // 1. Thử đọc cache trước
  const { data: cachedList, cacheKey } = await todoCache.getList(userId, {
    page,
    limit,
    keyword,
    filterTab,
  });

  if (cachedList) {
    return cachedList;
  }

  // 2. Cache miss → đọc database
  const offset = (page - 1) * limit;

  const result = await todoRepository.findTodosByUserId(userId, {
    keyword,
    filterTab,
    limit,
    offset,
  });

  const response = {
    data: result.todos,
    pagination: {
      page,
      limit,
      totalItems: result.totalItems,
      totalPages: Math.ceil(result.totalItems / limit),
    },
    stats: result.stats,
  };

  // 3. Lưu cache bằng đúng key đã tính ở bước 1
  await todoCache.setList(cacheKey, response);

  return response;
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
  await todoCache.deleteTodo(userId, todoId);
  await todoCache.bumpListVersion(userId);

  return todo;

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
  await todoCache.deleteTodo(userId, todoId);
  await todoCache.bumpListVersion(userId);

}

module.exports.getTodoById = async (userId, todoId) => {
  // 1. Thử đọc cache trước
  const cachedTodo = await todoCache.getTodo(userId, todoId);

  if (cachedTodo) {
    return cachedTodo;
  }

  // 2. Cache miss → đọc database (lọc theo cả id và user_id)
  const todo = await todoRepository.findTodoById(userId, todoId);

  if (!todo) {
    const error = new Error('Không tìm thấy công việc');
    error.statusCode = 404;
    error.code = 'TODO_NOT_FOUND';
    throw error; // không ghi cache cho trường hợp không tìm thấy
  }

  // 3. Lưu vào cache cho lần đọc sau
  await todoCache.setTodo(userId, todo);

  return todo;
};

