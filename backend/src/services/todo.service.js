const userRepository = require('../repositories/user.repository');
const todoRepository = require('../repositories/todo.repository');

module.exports.createPost = async (userId, { title, description }) => {
  try {
    const user = await userRepository.findUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const todo = await todoRepository.createTodo(userId, title, description || null, false);

    return todo;
    
  } catch (error) {
    throw new Error(
      result?.error?.message || 'Không tạo được công việc'
    );
  }
};

module.exports.getTodos = async (userId) => {
  return todoRepository.findTodosByUserId(userId);
}

module.exports.updateStatus = async (userId, todoId, completed) => {
 const todo = await todoRepository.updateStatus(userId, todoId, completed);

 if(!todo) {
  throw new Error('Công việc không tìm thấy');
 }

 return todo;
}