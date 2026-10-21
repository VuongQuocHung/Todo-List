const redisClient = require('../configs/redis.config');

const buildKey = (jti) => `auth:bl:${jti}`;

// Đưa token vào danh sách đen, tự xóa khi token hết hạn
module.exports.add = async (jti, ttlSeconds) => {
  await redisClient.set(buildKey(jti), '1', { EX: ttlSeconds });
};

// Token đã bị thu hồi chưa?
module.exports.has = async (jti) => {
  return (await redisClient.exists(buildKey(jti))) === 1;
};
