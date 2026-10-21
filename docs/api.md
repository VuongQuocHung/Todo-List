# Todo App — API contract

Đối chiếu source ngày **21/10/2026**. Base URL: /api. Đây là contract đọc từ route/controller/validation/repository hiện tại, chưa phải báo cáo kiểm thử.

## Quy ước

- Request có body dùng Content-Type: application/json.
- Thành công thường trả { "data": ... }; danh sách Todo có thêm pagination và stats.
- Lỗi trả { "error": { "code": "...", "message": "..." } }.
- 204 không có body; client không gọi response.json().
- Xác thực bằng cookie token chứa JWT. Không dùng Authorization Bearer trong implementation hiện tại.
- Ngày hạn/ngày hoàn thành có dạng YYYY-MM-DD hoặc null. Timestamp do driver serialize; timezone connection chưa được cấu hình rõ, cần kiểm chứng trước khi cam kết UTC xuyên suốt.

## 1. Authentication

### POST /api/auth/register

Không cần đăng nhập.

| Field | Bắt buộc | Validation/chuẩn hóa |
| --- | --- | --- |
| username | Có | String, trim, 3–50 ký tự, chữ ASCII/số/gạch dưới; không tự lowercase |
| fullname | Không | String tối đa 100 ký tự sau trim, chấp nhận null; rỗng thành null |
| email | Có | String, trim, lowercase, email hợp lệ, tối đa 255 ký tự |
| password | Có | String 8–72 ký tự và tối đa 72 byte UTF-8; không trim |

confirmPassword chỉ dùng trên UI. Schema auth không dùng strict như Todo; field ngoài schema không trở thành dữ liệu user được lưu.

Ví dụ request:

```json
{
  "username": "demo_user",
  "fullname": "Người dùng demo",
  "email": "demo@example.com",
  "password": "DemoPassword123!"
}
```

Thành công: 201, data gồm id, username, fullname, email, createdAt; không trả password/hash. Endpoint không tự đăng nhập hoặc cấp cookie.

Lỗi: 400 VALIDATION_ERROR; 409 USERNAME_ALREADY_EXISTS hoặc EMAIL_ALREADY_EXISTS. Service kiểm tra trùng và xử lý ER_DUP_ENTRY từ unique constraint.

### POST /api/auth/login

Body: email và password. Validation yêu cầu email hợp lệ, password tối thiểu 8 ký tự. Service trim/lowercase email rồi so sánh bcrypt.

Thành công: 200, data user an toàn; Set-Cookie token với HttpOnly, SameSite=Lax, Path=/, maxAge một ngày và Secure khi NODE_ENV=production. JWT expiresIn=1d. Token không nằm trong JSON.

Sai email/password: 401 INVALID_CREDENTIALS với thông báo chung. Body không hợp lệ: 400 VALIDATION_ERROR.

### GET /api/auth/me

Cần cookie hợp lệ. Middleware xác minh JWT bằng HS256; service đọc user theo ID.

- 200, data user an toàn; Cache-Control: no-store.
- 401 UNAUTHORIZED khi thiếu/sai/hết hạn token hoặc user không còn tồn tại.
- Đây là kiểm tra phiên, không phải refresh token.

### POST /api/auth/logout

Không bắt buộc token hợp lệ. Backend clearCookie với các thuộc tính tương ứng login và trả 204. Chưa có danh sách thu hồi JWT phía server.

## 2. Todo

Tất cả endpoint Todo dùng requireAuth. Chủ sở hữu lấy từ req.auth.userId, không nhận từ body. Truy vấn danh sách theo user_id, chi tiết/sửa/xóa theo id AND user_id. Không có hoặc không thuộc user đều trả 404 TODO_NOT_FOUND.

### GET /api/todos

| Query | Mặc định | Điều kiện |
| --- | --- | --- |
| page | 1 | Coerce number, số nguyên 1–1.000.000 |
| limit | 5 | Coerce number, số nguyên 1–20 |
| keyword | Chuỗi rỗng | String trim, tối đa 100 ký tự |
| filterTab | all | all, pending, completed, overdue |

Schema query strict, từ chối field lạ. Không dùng pageSize. Frontend hiện gửi limit=5.

```http
GET /api/todos?page=1&limit=5&keyword=bao%20cao&filterTab=pending
```

Thành công 200, ví dụ dữ liệu minh họa:

```json
{
  "data": [
    {
      "id": 12,
      "title": "Chuẩn bị báo cáo",
      "description": null,
      "completed": false,
      "dueDate": "2026-10-23",
      "completedDate": null,
      "createdAt": "2026-10-21T03:00:00.000Z",
      "updatedAt": "2026-10-21T03:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "totalItems": 1,
    "totalPages": 1
  },
  "stats": {
    "all": 1,
    "pending": 1,
    "completed": 0,
    "overdue": 0
  }
}
```

Timestamp trong ví dụ chỉ minh họa JSON, không phải kết quả nghiệm thu timezone.

- Search theo title LIKE %keyword%; dấu % và _ trong keyword hiện có ngữ nghĩa wildcard của LIKE, chưa được escape để tìm literal.
- Sort created_at DESC, id DESC; offset=(page-1)*limit.
- totalItems thuộc tab đang chọn; stats đếm từng tab trên toàn bộ kết quả tìm kiếm của user.
- overdue gồm chưa hoàn thành có due_date trước ngày Việt Nam hiện tại hoặc đã hoàn thành với completed_date > due_date.
- Không có kết quả: data=[], totalPages=0. Trang vượt dữ liệu trả mảng rỗng và metadata, không trả 404.
- Cache response danh sách theo user, version, page, limit, keyword và filterTab.

### GET /api/todos/:id

ID phải khớp regex /^[1-9]\d{0,19}$/; đây là kiểm tra định dạng chuỗi, chưa phải kiểm tra đầy đủ giới hạn BIGINT UNSIGNED.

- 200: { data: Todo }, cùng các field của item danh sách.
- 400: VALIDATION_ERROR nếu ID sai định dạng.
- 404: TODO_NOT_FOUND nếu không có/khác chủ.
- Cache key todo:{userId}:{todoId}, TTL mặc định 60 giây; không cache null.

Frontend hiện chưa có trang chi tiết và chưa gọi endpoint này qua todoApi.

### POST /api/todos

| Field | Bắt buộc | Quy tắc |
| --- | --- | --- |
| title | Có | String trim, 1–200 ký tự |
| description | Không | String trim, tối đa 2.000 ký tự hoặc null |
| dueDate | Không | Ngày ISO YYYY-MM-DD hợp lệ, năm từ 1000 hoặc null |

Schema strict: user_id, completed, id và field lạ bị từ chối. Todo luôn tạo với completed=false, completedDate=null. Service đổi description rỗng thành null. Tiêu đề trùng được phép.

```json
{
  "title": "Chuẩn bị demo",
  "description": "Kiểm tra luồng CRUD và cache",
  "dueDate": "2026-10-23"
}
```

Thành công 201, { data: Todo }. Sau khi tạo, tăng version danh sách của user. Body sai: 400; user không còn tồn tại: 401. Chưa có idempotency key; khóa submit frontend không bảo đảm exactly-once tại backend.

### PATCH /api/todos/:id

Chấp nhận ít nhất một field:

| Field | Quy tắc |
| --- | --- |
| title | Như create |
| description | String trim tối đa 2.000 ký tự hoặc null |
| dueDate | Như create hoặc null để bỏ hạn |
| completed | Boolean thật |

Schema strict; body rỗng/field lạ/sai kiểu trả 400. Field không gửi được giữ nguyên. Description rỗng ở PATCH được giữ là chuỗi rỗng sau trim; service không chuyển thành null như create, dù UI thường gửi null.

```json
{ "completed": true }
```

- Chuyển false → true: ghi completed_date bằng ngày Việt Nam.
- Gửi true khi đã true: giữ completed_date cũ.
- Gửi false: đặt completed_date=null.
- 200, { data: Todo }; 404 nếu không có/khác chủ.
- Ghi DB thành công rồi xóa cache chi tiết và tăng version danh sách.

### DELETE /api/todos/:id

Kiểm tra ID cùng regex trên. Xóa theo cả id/user_id.

- 204 không body nếu có bản ghi bị xóa.
- 404 TODO_NOT_FOUND nếu affectedRows=0.
- Sau xóa: DEL cache chi tiết và tăng version danh sách.

## 3. Health

GET /api/health không yêu cầu đăng nhập. Chạy SELECT 1; thành công trả:

```json
{ "status": "ok", "database": "connected" }
```

Lỗi DB chuyển tới error middleware. Endpoint này không kiểm tra Redis hay tất cả luồng nghiệp vụ.

## 4. Xử lý lỗi

| HTTP status | Trường hợp/mã thường gặp |
| --- | --- |
| 400 | VALIDATION_ERROR, thông báo lỗi validation đầu tiên |
| 401 | UNAUTHORIZED hoặc INVALID_CREDENTIALS |
| 404 | TODO_NOT_FOUND hoặc ROUTE_NOT_FOUND |
| 409 | EMAIL_ALREADY_EXISTS hoặc USERNAME_ALREADY_EXISTS |
| 500 | Lỗi server; message chung, log lỗi nội bộ |

Error middleware dùng error.code nếu có; nếu không, fallback INTERNAL_SERVER_ERROR cho lỗi server hoặc REQUEST_ERROR cho lỗi khác. Vì vậy không bảo đảm mọi lỗi DB đều mang code INTERNAL_SERVER_ERROR, dù message lỗi server được thay bằng thông báo chung.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Tiêu đề không được để trống"
  }
}
```

Chưa có fieldErrors trong contract. Hành vi runtime, malformed JSON và lỗi hạ tầng cần được kiểm thử riêng; có contract chưa đồng nghĩa đã nghiệm thu.
