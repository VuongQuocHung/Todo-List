const redisClient = require('../configs/redis.config');
const crypto = require('crypto');

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

// ===== Cache danh sách =====

// Mỗi user có 1 số phiên bản; tăng lên mỗi khi dữ liệu thay đổi
const buildListVersionKey = (userId) => `todos:ver:${userId}`;

// Băm tham số → key ngắn gọn, không lo từ khóa dài hoặc chứa ký tự lạ
const hashQuery = ({ page, limit, keyword, filterTab }) => {
  // Tự sắp thứ tự trường → cùng tham số luôn ra cùng 1 mã băm
  const normalized = JSON.stringify([page, limit, keyword, filterTab]);
  return crypto.createHash('sha1').update(normalized).digest('hex').slice(0, 16);
};

// Đọc cache danh sách. Trả về { data, cacheKey }:
// - data: kết quả nếu HIT, null nếu MISS
// - cacheKey: key để ghi lại sau khi đọc DB (null nếu Redis không dùng được)
module.exports.getList = async (userId, query) => {
  if (!redisClient.isReady) {
    return { data: null, cacheKey: null };
  }

  try {
    const version = (await redisClient.get(buildListVersionKey(userId))) ?? '0';
    const cacheKey = `todos:${userId}:v${version}:${hashQuery(query)}`;
    const value = await redisClient.get(cacheKey);

    if (isDev) {
      console.log(`[cache] ${value ? 'HIT ' : 'MISS'} ${cacheKey}`);
    }

    return { data: value ? JSON.parse(value) : null, cacheKey };
  } catch (error) {
    console.error('[cache] đọc danh sách lỗi:', error.message);
    return { data: null, cacheKey: null };
  }
};

// Ghi cache danh sách kèm TTL
module.exports.setList = async (cacheKey, data) => {
  if (!cacheKey || !redisClient.isReady) {
    return;
  }

  try {
    await redisClient.setEx(cacheKey, TTL_SECONDS, JSON.stringify(data));
  } catch (error) {
    console.error(`[cache] ghi ${cacheKey} lỗi:`, error.message);
  }
};

// Dữ liệu thay đổi → tăng phiên bản → mọi key danh sách cũ của user bị bỏ, tự hết hạn theo TTL
module.exports.bumpListVersion = async (userId) => {
  const versionKey = buildListVersionKey(userId);

  if (!redisClient.isReady) {
    return;
  }

  try {
    const version = await redisClient.incr(versionKey);

    if (isDev) {
      console.log(`[cache] INCR ${versionKey} → ${version}`);
    }
  } catch (error) {
    console.error(`[cache] tăng ${versionKey} lỗi:`, error.message);
  }
};
