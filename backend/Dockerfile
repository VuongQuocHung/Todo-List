# Image nền: Node 22 chạy trên Alpine Linux (bản rất nhỏ gọn)
FROM node:22-alpine

WORKDIR /app

# Copy file khai báo thư viện TRƯỚC rồi mới cài thư viện.
# Lần build sau, nếu chỉ sửa code thì layer này được dùng lại từ cache → không phải cài lại.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy code sau cùng (phần hay thay đổi nhất)
COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000

# Chạy bằng user thường thay vì root → nếu bị tấn công thì quyền hạn bị giới hạn
USER node

CMD ["node", "src/server.js"]
