# Todo App API

Base URL: `/api`

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
| `email` | string | Có | Đúng định dạng email, tối đa 255 ký tự; được loại bỏ khoảng trắng hai đầu và chuyển về chữ thường trước khi lưu |
| `password` | string | Có | Từ 8 đến 72 ký tự; không tự động trim |

Ví dụ:

```json
{
  "email": "test@example.com",
  "password": "12345678"
}
```

#### Thành công — `201 Created`

```json
{
  "data": {
    "id": 1,
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
    "message": "Dữ liệu không hợp lệ",
    "fieldErrors": {
      "email": "Email không hợp lệ",
      "password": "Mật khẩu phải có ít nhất 8 ký tự"
    }
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

#### Lỗi ngoài dự kiến — `500 Internal Server Error`

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Đã xảy ra lỗi, vui lòng thử lại sau"
  }
}
```
