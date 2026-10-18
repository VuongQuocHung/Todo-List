const userRepository = require('../repositories/user.repository');
const todoRepository = require('../repositories/todo.repository');

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

  return todo;
};

module.exports.getTodos = async (userId, keyword) => {
  return todoRepository.findTodosByUserId(userId, keyword);
}

module.exports.updateStatus = async (userId, todoId, completed) => {
 const todo = await todoRepository.updateStatus(userId, todoId, completed);

 if(!todo) {
  throw new Error('Công việc không tìm thấy');
 }

 return todo;
}

module.exports.updateTodo = async (userId, todoId, updateData) => {
  const todo = await todoRepository.updateTodo(userId, todoId, updateData);

  if (!todo) {
    const error = new Error('Công việc không tìm thấy');
    error.statusCode = 404;
    error.code = 'TODO_NOT_FOUND';
    throw error;
  }

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
}