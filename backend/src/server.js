require('dotenv').config();

const app = require('./app');
const redisClient = require('./configs/redis.config');

const port = Number(process.env.PORT || 3000);

// Không await: Redis chưa sẵn sàng thì backend vẫn chạy, chỉ là chưa có cache
redisClient.connect().catch((error) => {
  console.error('[redis] không kết nối được:', error.message);
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
