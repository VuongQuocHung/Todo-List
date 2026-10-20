const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: 2000, // không chờ kết nối quá 2 giây
    // Mất kết nối → thử lại sau 0.5s, 1s, 1.5s... tối đa 5s/lần
    reconnectStrategy: (retries) => Math.min(retries * 500, 5000),
  },
  // Redis đang mất kết nối → lệnh báo lỗi NGAY thay vì xếp hàng chờ.
  // Nhờ vậy request không bị treo, service có thể chuyển sang đọc database.
  disableOfflineQueue: true,
});

redisClient.on('ready', () => {
  console.log('[redis] đã kết nối');
});

// Bắt buộc phải lắng nghe 'error', nếu không lỗi Redis sẽ làm sập cả server
redisClient.on('error', (error) => {
  console.error('[redis] lỗi:', error.message);
});

module.exports = redisClient;
