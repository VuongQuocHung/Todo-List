const crypto = require('crypto');
const cache = require('./cache');

// ===== Cách đặt key cho todo =====

// Key chứa userId lấy từ token → mỗi user một vùng cache riêng
const buildTodoKey = (userId, todoId) => `todo:${userId}:${todoId}`;

// Mỗi user 1 số phiên bản cho danh sách; tăng lên mỗi khi dữ liệu thay đổi
const buildListVersionKey = (userId) => `todos:ver:${userId}`;

// Băm tham số → key ngắn gọn; giữ cố định thứ tự trường
const hashQuery = ({ page, limit, keyword, filterTab }) => {
  const normalized = JSON.stringify([page, limit, keyword, filterTab]);
  return crypto.createHash('sha1').update(normalized).digest('hex').slice(0, 16);
};

// Key danh sách = userId + phiên bản hiện tại + mã băm tham số
// Redis lỗi → null → withCache bỏ qua cache, đọc thẳng database
const buildListKey = async (userId, query) => {
  const version = await cache.getVersion(buildListVersionKey(userId));

  if (version === null) {
    return null;
  }

  return `todos:${userId}:v${version}:${hashQuery(query)}`;
};

// ===== Xóa cache khi dữ liệu thay đổi =====

// Sửa/xóa 1 công việc → xóa cache chi tiết của nó
const invalidateTodo = (userId, todoId) => cache.del(buildTodoKey(userId, todoId));

// Tạo/sửa/xóa → tăng phiên bản → mọi key danh sách cũ của user bị bỏ, tự hết hạn theo TTL
const invalidateTodoLists = (userId) => cache.incr(buildListVersionKey(userId));

module.exports = { buildTodoKey, buildListKey, invalidateTodo, invalidateTodoLists };
