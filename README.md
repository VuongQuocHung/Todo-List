# Todo App

Ứng dụng quản lý công việc cá nhân: đăng ký/đăng nhập, CRUD, hoàn thành, hạn/ngày hoàn thành, tìm kiếm, lọc và phân trang.

Frontend React + Vite + SWR; backend Express + MySQL + Redis. Nginx phục vụ SPA và proxy API. Redis cache cả danh sách lẫn chi tiết.

[Báo cáo project](docs/TodoApp.md) · [Kiến trúc](docs/architecture.md) · [API](docs/api.md) · [Sequence](docs/sequence-diagrams.md) · [Tiến độ/kiểm thử](docs/timeline.md)

Tài liệu đối chiếu source local ngày **21/10/2026**, gồm thay đổi chưa commit; hướng dẫn chưa được nghiệm thu lại trên môi trường sạch trong lần cập nhật này.

## Yêu cầu

- Docker Desktop/Engine có Docker Compose v2, daemon đang chạy.
- Cổng 8080 trống; cổng 3307 chỉ cần trống nếu dùng dev override.
- File cấu hình .env từ mẫu, dùng giá trị riêng cho mật khẩu và JWT_SECRET.

## Khởi chạy local để phát triển/demo

Clone repository nếu chưa có:

```bash
git clone https://github.com/VuongQuocHung/Todo-List.git
cd Todo-List
```

Nếu chưa có .env, tạo từ mẫu:

```powershell
Copy-Item .env.example .env
```

Git Bash/macOS/Linux dùng cp .env.example .env. Sửa mật khẩu và JWT_SECRET; MYSQL_USER là tài khoản app, không dùng root. Giữ MYSQL_DATABASE=todo_app: migration hiện có CREATE DATABASE/USE todo_app, nên đổi tên DB cần đồng bộ SQL.

Chạy với cấu hình development để quan sát cache và dùng cookie không Secure trên HTTP local:

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build
docker compose -f docker-compose.yml -f docker-compose.dev.yml ps
```

Mở **http://localhost:8080**, đăng ký tài khoản rồi đăng nhập. Thời gian khởi tạo tùy máy; xem trạng thái/log, không mặc định chờ một khoảng cố định là đủ.

Dev override publish MySQL 3307:3306 để debug và đặt NODE_ENV=development cho backend. Đây không phải cấu hình triển khai production.

## Cấu hình Compose chính

```powershell
docker compose up -d --build
docker compose ps
```

File chính chỉ publish frontend 8080:80; không publish MySQL/backend/Redis ra host. NODE_ENV=production khiến cookie token có Secure; Nginx hiện chỉ cấu hình HTTP. Cần kiểm tra cookie theo hostname/trình duyệt thực tế và cấu hình HTTPS trước khi triển khai; không coi bộ Compose này đã sẵn sàng production chỉ vì NODE_ENV là production.

| Service | Vai trò |
| --- | --- |
| frontend | Build React nhiều giai đoạn, Nginx phục vụ dist/proxy /api/fallback SPA |
| backend | Express :3000, user node, kết nối DB/cache bằng service name |
| mysql | MySQL 8.4, volume mysql_data, SQL init |
| redis | Redis 7 Alpine, cache dữ liệu đọc |

MySQL/Redis/backend có healthcheck; backend chờ DB/Redis healthy. /api/health chỉ kiểm tra SELECT 1 tại DB, không kiểm thử toàn bộ nghiệp vụ.

## Migration và dữ liệu

Migration hiện tại: backend/migrations/001_init.sql, gồm users/todos/tags/todo_tags. Tag chưa có API/UI.

MySQL tự chạy SQL trong /docker-entrypoint-initdb.d khi data directory trống. Khi volume đã có dữ liệu, restart hoặc rebuild không tự áp dụng lại migration. Có schema mới thì cần migration nâng cấp riêng, kiểm tra trên dữ liệu thử trước khi áp dụng; không xóa volume để cập nhật schema đang dùng.

Dữ liệu MySQL lưu trong named volume mysql_data. docker compose down giữ volume; **docker compose down -v xóa dữ liệu**. Không dùng tùy chọn -v với dữ liệu muốn giữ.

## Quan sát và thao tác thường dùng

Với cấu hình dev:

```powershell
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f backend
docker compose -f docker-compose.yml -f docker-compose.dev.yml stop
docker compose -f docker-compose.yml -f docker-compose.dev.yml start
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

Với cấu hình chính, bỏ hai tham số -f. Sau đổi source, chạy lại lệnh up -d --build tương ứng cấu hình đang dùng.

Cache log HIT/MISS/DEL/INCR chỉ bật ở development. TTL mặc định 60 giây; tạo/sửa/xóa tăng version danh sách, sửa/xóa còn xóa cache chi tiết. Redis lỗi lúc app chạy có đường fallback DB, nhưng Compose vẫn chờ Redis healthy khi khởi động backend.

## Chạy app trực tiếp, không dùng Docker cho Node/React

Cần Node/npm phù hợp dependency (Docker dùng Node 22), MySQL/Redis đang chạy và đã áp dụng 001_init.sql.

Backend, trong terminal riêng:

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run dev
```

Sửa backend/.env để khớp DB/Redis. Nếu dùng MySQL từ dev Compose, DB_PORT trên host là 3307. Redis trong Compose không publish port; muốn backend chạy trên host thì cần Redis truy cập được từ host với REDIS_URL phù hợp.

Frontend, trong terminal riêng:

```powershell
cd frontend
npm install
npm run dev
```

Vite mặc định http://localhost:5173, proxy /api tới http://localhost:3000.

## Kiểm tra và giới hạn

Trong frontend:

```powershell
npm run lint
npm run build
```

Chưa chạy các lệnh này trong lần cập nhật tài liệu. Backend npm test hiện là placeholder, chưa có suite test tự động thực tế. Checklist và nơi ghi bằng chứng: [timeline](docs/timeline.md).

Các điểm cần hoàn thiện: ProtectedRoute/chờ auth, kiểm chứng cache SWR khi đổi tài khoản và loading khi đổi query, thống nhất client cho Login/Register, timezone timestamp và dọn log debug. Logout xóa cookie nhưng chưa thu hồi JWT phía server. Không có admin, chia sẻ, refresh token hoặc public deployment đã được xác nhận.
