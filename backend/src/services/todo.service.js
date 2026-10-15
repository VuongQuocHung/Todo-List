const userRepository = require('../repositories/user.repository');
const todoRepository = require('../repositories/todo.repository');

module.exports.createPost = async (userId, { title, description }) => {
  try {
    const user = await userRepository.findUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const todo = await todoRepository.createTodo(userId, title, description, false);

    return todo;
    
  } catch (error) {
    console.error(error);
    return;
  }
};