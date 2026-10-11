# Kiến trúc Todo App

## Backend

Backend Express sử dụng 3-layer architecture và tổ chức thư mục theo layer.

Backend dùng CommonJS với `require` và `module.exports`. Frontend Vite dùng ES Modules theo cấu hình mặc định của Vite.

```text
src/
├── routes/
├── controllers/
├── services/
├── repositories/
├── validations/
├── middlewares/
├── configs/
├── cache/
├── app.js
└── server.js
```

### Các layer

1. Presentation layer
   - `routes`: khai báo URL, HTTP method và chuỗi middleware/controller.
   - `controllers`: đọc dữ liệu HTTP, gọi service và trả HTTP response.
   - `validations`: kiểm tra body, params và query trước controller.
   - `middlewares`: xử lý chung như authentication, 404 và error handling.

2. Business layer
   - `services`: chứa nghiệp vụ như đăng ký, đăng nhập, kiểm tra quyền sở hữu todo và phối hợp cache.
   - Service không sử dụng trực tiếp `req` hoặc `res`.

3. Data access layer
   - `repositories`: chứa SQL tham số hóa và thao tác MySQL.
   - Repository không quyết định HTTP status và không phụ thuộc controller/service.

Các phần `configs` và `cache` là hạ tầng dùng chung, hỗ trợ các layer.

### Luồng request

```text
Request
  → Route
  → Validation / Authentication middleware
  → Controller
  → Service
  → Repository
  → MySQL
```

Khi trả kết quả, dữ liệu đi theo chiều ngược lại. Lỗi được chuyển tới error middleware để tạo response thống nhất.

### Quy tắc phụ thuộc

```text
Controller → Service → Repository → MySQL
```

- Controller không viết SQL.
- Repository không sử dụng `req` hoặc `res`.
- Service không tự tạo HTTP response.
- Route không chứa nghiệp vụ.
- Frontend React là phần giao diện riêng và gọi backend qua REST API.

### Ví dụ đăng ký

```text
POST /api/auth/register
  → auth.routes.js
  → auth.validation.js
  → auth.controller.js
  → auth.service.js
  → user.repository.js
  → users table
```

## Frontend

Frontend React được tổ chức theo trang và chức năng giao diện. Đây là phần View của toàn hệ thống, nhưng chạy tách biệt với backend Express.

```text
src/
├── pages/
├── features/
│   ├── auth/
│   └── todos/
├── components/
├── lib/
├── App.jsx
└── main.jsx
```

- `pages`: ghép component thành màn hình.
- `features`: code chỉ thuộc một chức năng như auth hoặc todos.
- `components`: component dùng chung.
- `lib`: API client và tiện ích dùng chung.
