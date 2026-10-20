# ===== Giai đoạn 1: build React thành file tĩnh =====
FROM node:22-alpine AS build

WORKDIR /app

# Cài thư viện trước (cache layer), cần cả devDependencies vì Vite nằm trong đó
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ===== Giai đoạn 2: chỉ giữ Nginx + file đã build =====
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
