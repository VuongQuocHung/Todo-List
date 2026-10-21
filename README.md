# Todo App

Ứng dụng quản lý công việc: đăng ký/đăng nhập, tạo/sửa/xóa công việc, lọc, tìm kiếm, phân trang.

- Frontend: React + Vite, SWR, phục vụ bằng Nginx
- Backend: Node.js + Express, MySQL, Redis (cache)

## Yêu cầu

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (có Docker Compose v2)
- Các cổng **8080** (web) và **3307** (MySQL) đang trống

## Chạy bằng Docker Compose

```bash
git clone https://github.com/VuongQuocHung/Todo-List.git
cd Todo-List
```

Tạo file cấu hình từ file mẫu:

```bash
# Git Bash / macOS / Linux
cp .env.example .env

# PowerShell
Copy-Item .env.example .env
```

Mở `.env` và đổi **toàn bộ mật khẩu** cùng `JWT_SECRET`. Lưu ý: `MYSQL_USER` là tài khoản riêng cho app, **không được đặt là `root`**.

Khởi động:

```bash
docker compose up -d --build
```

Đợi khoảng 30 giây, kiểm tra trạng thái:

```bash
docker compose ps
```

Khi `mysql`, `redis`, `backend` đều là `(healthy)`, mở **http://localhost:8080** và đăng ký tài khoản mới.

## Migration

Lần khởi động đầu tiên (database còn trống), MySQL tự chạy các file trong `backend/migrations/` theo thứ tự tên file.

Các lần khởi động sau, dữ liệu đã có sẵn nên migration **không chạy lại**. Khi có file migration mới, chạy thủ công:

```bash
docker compose exec -T mysql sh -c 'mysql -u root -p"$MYSQL_ROOT_PASSWORD" todo_app' < backend/migrations/<tên-file>.sql
```

## Các lệnh thường dùng

| Việc                                    | Lệnh                             |
| --------------------------------------- | -------------------------------- |
| Xem log                                 | `docker compose logs -f backend` |
| Tạm dừng                                | `docker compose stop`            |
| Chạy lại                                | `docker compose start`           |
| Dừng và xóa container (**giữ dữ liệu**) | `docker compose down`            |
| Build lại sau khi sửa code              | `docker compose up -d --build`   |

> ⚠️ `docker compose down -v` **xóa toàn bộ dữ liệu MySQL**. Chỉ dùng khi muốn bắt đầu lại với database trống.

## Chạy khi phát triển (không dùng Docker cho app)

Cần MySQL và Redis đang chạy trên máy, và đã chạy `backend/migrations/001_init.sql`.

```bash
# Backend
cd backend
cp .env.example .env   # rồi sửa thông tin MySQL/Redis
npm install
npm run dev            # http://localhost:3000

# Frontend (terminal khác)
cd frontend
npm install
npm run dev            # http://localhost:5173, tự proxy /api sang backend
```
