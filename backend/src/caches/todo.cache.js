const redisClient = require('../configs/redis.config');

const TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS || 60);
const isDev = process.env.NODE_ENV === 'development';

// Key chứa userId lấy từ token → mỗi user một vùng cache riêng
const buildTodoKey = (userId, todoId) => `todo:${userId}:${todoId}`;

// Đọc cache. Redis chưa sẵn sàng hoặc lỗi → trả null (coi như miss)
module.exports.getTodo = async (userId, todoId) => {
  const key = buildTodoKey(userId, todoId);

  if (!redisClient.isReady) {
    return null;
  }

  try {
    const value = await redisClient.get(key);

    if (isDev) {
      console.log(`[cache] ${value ? 'HIT ' : 'MISS'} ${key}`);
    }

    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`[cache] đọc ${key} lỗi:`, error.message);
    return null;
  }
};

// Ghi cache kèm thời hạn. Lỗi thì chỉ log, không làm hỏng request
module.exports.setTodo = async (userId, todo) => {
  const key = buildTodoKey(userId, todo.id);

  if (!redisClient.isReady) {
    return;
  }

  try {
    await redisClient.setEx(key, TTL_SECONDS, JSON.stringify(todo));
  } catch (error) {
    console.error(`[cache] ghi ${key} lỗi:`, error.message);
  }
};

// Xóa cache khi dữ liệu thay đổi. Lỗi thì chỉ log, TTL sẽ tự dọn sau
module.exports.deleteTodo = async (userId, todoId) => {
  const key = buildTodoKey(userId, todoId);

  if (!redisClient.isReady) {
    return;
  }

  try {
    await redisClient.del(key);

    if (isDev) {
      console.log(`[cache] DEL  ${key}`);
    }
  } catch (error) {
    console.error(`[cache] xóa ${key} lỗi:`, error.message);
  }
};

