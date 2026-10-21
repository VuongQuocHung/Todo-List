const redisClient = require('../configs/redis.config');

const DEFAULT_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS || 60);
const isDev = process.env.NODE_ENV === 'development';

const log = (message) => {
  if (isDev) {
    console.log(`[cache] ${message}`);
  }
};

// ===== Thao tác Redis cơ bản — lỗi thì log và coi như không có cache =====

// Đọc giá trị JSON. Không có / Redis lỗi → undefined
const getJson = async (key) => {
  if (!redisClient.isReady) {
    return undefined;
  }

  try {
    const value = await redisClient.get(key);
    return value === null ? undefined : JSON.parse(value);
  } catch (error) {
    console.error(`[cache] đọc ${key} lỗi:`, error.message);
    return undefined;
  }
};

// Ghi giá trị JSON kèm thời hạn
const setJson = async (key, value, ttlSeconds) => {
  if (!redisClient.isReady) {
    return;
  }

  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    console.error(`[cache] ghi ${key} lỗi:`, error.message);
  }
};

// Xóa 1 key
const del = async (key) => {
  if (!redisClient.isReady) {
    return;
  }

  try {
    await redisClient.del(key);
    log(`DEL  ${key}`);
  } catch (error) {
    console.error(`[cache] xóa ${key} lỗi:`, error.message);
  }
};

// Tăng số phiên bản lên 1
const incr = async (key) => {
  if (!redisClient.isReady) {
    return;
  }

  try {
    const version = await redisClient.incr(key);
    log(`INCR ${key} → ${version}`);
  } catch (error) {
    console.error(`[cache] tăng ${key} lỗi:`, error.message);
  }
};

// Đọc số phiên bản (chưa có thì là 0). Redis lỗi → null để bên gọi bỏ qua cache
const getVersion = async (key) => {
  if (!redisClient.isReady) {
    return null;
  }

  try {
    return Number((await redisClient.get(key)) ?? 0);
  } catch (error) {
    console.error(`[cache] đọc ${key} lỗi:`, error.message);
    return null;
  }
};

// ===== Hàm bọc cache (giống function_cached trong ví dụ fibo) =====
// fn:          hàm tính toán gốc (async), không biết gì về cache
// buildKey:    (...cùng tham số với fn) => key, hoặc null để bỏ qua cache
// ttlSeconds:  thời hạn của key
// shouldCache: kết quả nào thì được lưu (mặc định: không lưu null/undefined)
const withCache = (fn, {
  buildKey,
  ttlSeconds = DEFAULT_TTL_SECONDS,
  shouldCache = (value) => value !== null && value !== undefined,
}) => {
  return async (...args) => {
    const key = await buildKey(...args);

    // Không tạo được key (vd Redis lỗi khi đọc phiên bản) → chạy thẳng hàm gốc
    if (!key) {
      return fn(...args);
    }

    const cachedValue = await getJson(key);

    if (cachedValue !== undefined) {
      log(`HIT  ${key}`);
      return cachedValue;
    }

    log(`MISS ${key}`);

    const value = await fn(...args);

    if (shouldCache(value)) {
      await setJson(key, value, ttlSeconds);
    }

    return value;
  };
};

module.exports = { withCache, del, incr, getVersion };
