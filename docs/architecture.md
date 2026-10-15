# Kiến trúc Todo App

Cập nhật 15/10/2026. Tiến độ/task xem [timeline.md](timeline.md), contract xem [api.md](api.md). “Có code” chưa có nghĩa đã được nghiệm thu.

Kịch bản theo mẫu phân tích thiết kế và sequence diagram của từng use case: [sequence-diagrams.md](sequence-diagrams.md). Cập nhật luồng ở file đó khi implementation thay đổi.

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
├── cache/          # Dự kiến khi làm Redis, hiện chưa có
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
  → auth.route.js
  → auth.validation.js
  → auth.controller.js
  → auth.service.js
  → user.repository.js
  → users table
```

## Frontend

Frontend React + Vite là SPA, dùng React Router. Hiện tổ chức theo page, component dùng chung và Context. Cấu trúc thực tế:

```text
src/
├── pages/
│   ├── HomePage.jsx
│   ├── RegisterPage.jsx
│   ├── LoginPage.jsx
│   └── TodoApp.jsx
├── components/
│   └── layout/
│       └── Header.jsx
├── contexts/
│   ├── AuthContext.js
│   └── AuthProvider.jsx
├── App.jsx
└── main.jsx
```

- `pages`: ghép component thành màn hình.
- `components`: component dùng chung.
- `contexts`: chia sẻ thông tin user và các thao tác login/logout.
- Chưa có thư mục features/lib, custom hook useAuth hoặc ProtectedRoute trong source hiện tại. Tách API client khi có lặp code thực tế.

## Authentication hiện tại

```text
LoginPage → POST /auth/login → service so sánh bcrypt → JWT
          ← Set-Cookie token + JSON user
LoginPage → login(data.data) trong Context → Header render username

Refresh → AuthProvider GET /auth/me kèm cookie
        → requireAuth xác minh JWT → controller/service → findUserById
        ← JSON user → Context → Header

Header logout → POST /auth/logout → clearCookie → 204
              → frontend setUser(null)
```

- Cookie HttpOnly chứa JWT hạn 1 ngày; frontend không đọc token, Context chỉ giữ user.
- Frontend dùng useEffect cleanup để bỏ qua kết quả effect cũ; chưa có tự refresh token hay tự kiểm tra phiên định kỳ.
- Logout xóa cookie hiện tại, không thu hồi bản sao JWT còn hạn.
- /todos hiện chưa được chặn bởi ProtectedRoute. Đó là task A03; auth middleware backend vẫn bắt buộc cho API Todo.
- Code auth đã có nhưng còn chờ kiểm tra browser flow và request lỗi. Các thay đổi được người thực hiện tự gõ lại nên cần chạy nghiệm thu, không dựa vào kết quả build của phiên trước.

## Todo và hạ tầng dự kiến

- UI Todo hiện dùng content/status với dữ liệu mẫu; database dùng title/description/completed. Chốt hai trạng thái và đổi UI trước khi nối API.
- API Todo sẽ dùng cùng 3-layer và gắn chủ sở hữu từ req.auth.userId; repository lọc id + user_id.
- Paging dùng LIMIT/OFFSET, sort created_at + id; kiểm tra bằng EXPLAIN với dữ liệu thử.
- Redis dự kiến cache chi tiết theo userId/todoId, TTL 60s; xóa cache sau ghi và fallback DB khi Redis lỗi.
- Docker dự kiến bốn service frontend/backend/MySQL/Redis, Nginx proxy /api và fallback index.html.
- Cache, Docker và API Todo chưa tồn tại trong source ngày cập nhật này; xem deadline triển khai ở timeline.
