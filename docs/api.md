# Todo App API

Base URL: `/api`

Cập nhật 15/10/2026. Auth bên dưới đã có code, chờ kiểm tra end-to-end theo [timeline](timeline.md). API Todo ở cuối tài liệu là contract dự kiến, chưa được implement.

Quy ước: thành công trả `{ "data": ... }`; lỗi trả `{ "error": { "code": "...", "message": "..." } }`. Dùng HTTP status; frontend kiểm tra `response.ok`. Response 204 không có JSON body.

## Authentication

### Register

`POST /api/auth/register`

Tạo một tài khoản mới.

#### Headers

```http
Content-Type: application/json
```

#### Request body

| Field | Type | Bắt buộc | Quy tắc |
|---|---|---:|---|
| `username` | string | Có | Từ 3 đến 50 ký tự; chỉ gồm chữ cái, số và dấu gạch dưới; code hiện loại bỏ khoảng trắng hai đầu, không tự chuyển chữ thường |
| `fullname` | string | Không | Tối đa 100 ký tự; chuỗi rỗng được lưu thành `null` |
| `email` | string | Có | Đúng định dạng email, tối đa 255 ký tự; được loại bỏ khoảng trắng hai đầu và chuyển về chữ thường trước khi lưu |
| `password` | string | Có | Từ 8 đến 72 ký tự; không tự động trim |

Ví dụ:

```json
{
  "username": "test_user",
  "fullname": "Nguyễn Văn Test",
  "email": "test@example.com",
  "password": "12345678"
}
```

#### Thành công — `201 Created`

```json
{
  "data": {
    "id": 1,
    "username": "test_user",
    "fullname": "Nguyễn Văn Test",
    "email": "test@example.com",
    "createdAt": "2026-10-09T08:00:00.000Z"
  }
}
```

Response không bao gồm `password` hoặc `password_hash`.

#### Dữ liệu không hợp lệ — `400 Bad Request`

Ví dụ email sai định dạng và mật khẩu quá ngắn:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email không hợp lệ"
  }
}
```

#### Email đã tồn tại — `409 Conflict`

```json
{
  "error": {
    "code": "EMAIL_ALREADY_EXISTS",
    "message": "Email đã được đăng ký"
  }
}
```

#### Username đã tồn tại — `409 Conflict`

```json
{
  "error": {
    "code": "USERNAME_ALREADY_EXISTS",
    "message": "Username đã được sử dụng"
  }
}
```

#### Lỗi ngoài dự kiến — `500 Internal Server Error`

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Đã xảy ra lỗi, vui lòng thử lại sau"
  }
}
```

### Login — có code, chờ nghiệm thu

`POST /api/auth/login`

```json
{
  "email": "test@example.com",
  "password": "12345678"
}
```

Code hiện kiểm tra email hợp lệ, password tối thiểu 8 ký tự. Email được trim và chuyển chữ thường ở service. Thành công trả 200 với `data` gồm `id`, `username`, `fullname`, `email`, `createdAt`. Không trả token/hash trong JSON.

Response đặt cookie `token`: HttpOnly, SameSite=Lax, Path=/, Secure khi NODE_ENV=production; JWT và cookie hạn 1 ngày. Frontend gọi API cùng origin qua proxy, gửi cookie bằng `credentials: 'include'`.

Sai thông tin đăng nhập trả 401:

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email hoặc mật khẩu không đúng"
  }
}
```

Body sai trả 400 VALIDATION_ERROR; lỗi hệ thống trả 500 với message chung.

### Current user — có code, chờ nghiệm thu

`GET /api/auth/me`

Yêu cầu cookie `token` hợp lệ. Backend xác minh JWT, lấy userId từ payload rồi query tài khoản theo ID. Thành công trả 200 với `data` có cùng các trường user an toàn như login. Có `Cache-Control: no-store`.

Không có cookie, token sai/hết hạn hoặc tài khoản không còn tồn tại: 401 với `error.code = UNAUTHORIZED`; thông báo cụ thể có thể khác giữa middleware và service.

### Logout — có code, chờ nghiệm thu

`POST /api/auth/logout`

Backend xóa cookie `token`, trả **204 No Content**. Frontend không gọi `response.json()` và xóa user khỏi Context. Endpoint cho phép xóa cookie kể cả khi chưa xác thực. Chưa có refresh token hoặc cơ chế thu hồi ngay bản JWT đã được sao chép.

## Todo — contract dự kiến, chưa implement

Tất cả endpoint dưới đây cần requireAuth. Backend lấy chủ sở hữu từ token đã xác minh, không nhận user_id từ body để quyết định quyền. Todo không tồn tại hoặc không thuộc user trả 404 TODO_NOT_FOUND.

| Method | Endpoint | Request | Response thành công |
|---|---|---|---|
| GET | `/api/todos?page=1&pageSize=10` | Query page/pageSize | 200, data là mảng và pagination |
| GET | `/api/todos/:id` | ID số nguyên dương | 200, data là Todo; dự kiến có cache |
| POST | `/api/todos` | title, description tùy chọn | 201, data là Todo mới, completed mặc định false |
| PATCH | `/api/todos/:id` | Ít nhất một field title/description/completed | 200, data là Todo đã sửa |
| DELETE | `/api/todos/:id` | Không cần body | 204, không có body |

Todo response dự kiến:

```json
{
  "data": {
    "id": 1,
    "title": "Học Docker",
    "description": "Chạy ứng dụng bằng Compose",
    "completed": false,
    "createdAt": "2026-10-15T08:00:00.000Z",
    "updatedAt": "2026-10-15T08:00:00.000Z"
  }
}
```

`title`: trim, 1–200 ký tự. `description`: tùy chọn, tối đa 2.000 ký tự; có thể null. `completed`: boolean thật. PATCH rỗng hoặc không có field hợp lệ trả 400. ID, page, pageSize phải hợp lệ; page >= 1, pageSize 1–100. Các giới hạn BIGINT/JavaScript và múi giờ cần được quyết định/kiểm chứng khi implement.

Response danh sách dự kiến:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

Đếm tổng chỉ theo user hiện tại; sort `created_at DESC, id DESC`. Trang vượt dữ liệu trả mảng rỗng, không coi là 404. Response ngày giờ ISO 8601 UTC là mục tiêu cần test với cấu hình MySQL/driver.

Các lỗi dự kiến: 400 VALIDATION_ERROR, 401 UNAUTHORIZED, 404 TODO_NOT_FOUND, 500 INTERNAL_SERVER_ERROR. Frontend hiển thị lỗi bằng `error.message`. Dạng lỗi fieldErrors chưa phải behavior hiện tại.
