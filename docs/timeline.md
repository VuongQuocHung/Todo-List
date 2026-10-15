# Kế hoạch và timeline Todo App

## 1. Mục tiêu bàn giao

Gửi link GitHub và demo React SPA + Express + MySQL, gồm authentication, CRUD Todo cá nhân, validation/error handling, phân trang, caching và Docker. Người khác chạy được theo README và người thực hiện giải thích được luồng code.

Phạm vi ưu tiên: mỗi user quản lý Todo riêng; `title`, `description`, `completed`. Admin, chia sẻ công việc, refresh token, quên mật khẩu, tìm kiếm và deploy Internet để sau bản bắt buộc. Hai trạng thái Todo: chưa hoàn thành/đã hoàn thành.

## 2. Tiến độ theo source ngày 15/10

Đây là rà soát source, không phải xác nhận đã test toàn bộ trên môi trường sạch. Chỉ chuyển sang “Xong” khi có bằng chứng kiểm tra.

| Hạng mục                                     | Trạng thái hiện tại                            | Còn thiếu                                              |
| -------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| React SPA, React Router, giao diện home/auth | Có code                                        | Kiểm tra lại toàn luồng và màn hình nhỏ                |
| Express theo controller–service–repository   | Có code                                        | Giữ thống nhất khi thêm Todo                           |
| MySQL, bảng users/todos, migration 001/002   | Có file migration; đã kết nối ở các lượt trước | Chạy lại từ database sạch và đối chiếu schema          |
| Register/login/JWT HttpOnly cookie           | Có code, chờ nghiệm thu                        | Test hợp lệ/sai/trùng, bỏ log mật khẩu                 |
| `/me`, logout, Context và Header             | Có code, chờ nghiệm thu                        | Test F5, cookie hết hạn/sai, logout 204                |
| Bảo vệ trang `/todos`                        | Chưa có ProtectedRoute trong App hiện tại      | Thêm chặn giao diện; bảo vệ API độc lập                |
| Todo frontend                                | Demo bằng state, dùng content/status           | Đổi sang title/description/completed và gọi API        |
| CRUD API Todo, quyền sở hữu                  | Chưa có                                        | Xây dựng và test hai tài khoản                         |
| Paging                                       | Chưa có                                        | LIMIT/OFFSET, total và điều khiển trang                |
| Cache Redis                                  | Chưa có                                        | Cache-aside chi tiết Todo, TTL, invalidation, fallback |
| Docker                                       | Chưa có                                        | Frontend/backend/MySQL/Redis và cách chạy migration    |
| Test tự động                                 | Chưa có suite thực tế                          | Backend script test hiện là placeholder                |
| Docs                                         | Có API và architecture ban đầu                 | Đồng bộ source, README, bằng chứng và demo             |

## 3. Năng lực thời gian và phụ thuộc

Ước lượng khoảng **37 giờ làm việc tập trung**, cộng **2 giờ dự phòng**, trong 15–23/10. Cần khoảng 4–5 giờ/ngày ở các ngày triển khai; bao gồm cả cuối tuần 17–18/10. Đây là giả định lập lịch, chưa phải thời gian người thực hiện đã cam kết. Nếu không đủ thời gian, báo mentor ngay trong ngày 15/10 để điều chỉnh.

Làm frontend trước theo từng luồng: chốt contract → làm UI nhỏ → backend tương ứng → nối API → kiểm tra. Tránh làm hết UI rồi mới bắt đầu toàn bộ backend.

```text
Chốt auth và contract Todo
→ UI danh sách/tạo → API danh sách/tạo → tích hợp
→ UI sửa/xóa/chi tiết → API tương ứng → kiểm tra quyền
→ paging → caching → Docker → kiểm thử sạch → demo
```

Các task dưới đây chưa được đánh dấu xong, kể cả task đã có một phần code. “Đang làm” là chặng hiện tại; còn lại là “Chưa làm”. Ước lượng gồm tự học và kiểm tra cơ bản; kiểm thử hồi quy có chặng riêng.

## 4. Task nhỏ và deadline

### 15/10 — chốt auth và phạm vi (4 giờ)

| ID  | Task                                                                                      | Ước lượng | Phụ thuộc             | Deadline    | Trạng thái | Điều kiện xong                                                                      |
| --- | ----------------------------------------------------------------------------------------- | --------: | --------------------- | ----------- | ---------- | ----------------------------------------------------------------------------------- |
| A01 | Test register: thiếu fullname, thiếu username, trùng email/username; bỏ log chứa password |        1h | Code register hiện có | 15/10 17:00 | Đang làm   | 201/400/409 đúng; DB lưu hash; fullname rỗng là NULL                                |
| A02 | Test login, Context, Header, F5 và logout; sửa lỗi tìm thấy                               |      1.5h | A01                   | 15/10 19:00 | Đang làm   | Login đổi Header ngay; F5 gọi me; logout 204 không parse JSON; me sau logout là 401 |
| A03 | Thêm ProtectedRoute và test chưa đăng nhập mở `/todos`                                    |      0.5h | A02                   | 15/10 20:00 | Chưa làm   | Chờ kiểm tra phiên; chưa login chuyển /login; ghi rõ API phải tự bảo vệ             |
| A04 | Chốt contract Todo hai trạng thái, gửi plan và xin review mentor                          |        1h | A02                   | 15/10 21:00 | Chưa làm   | API fields thống nhất với DB; mentor nhận được plan/link source                     |

### 16/10 — xem và tạo Todo (5 giờ)

| ID  | Task                                                                            | Ước lượng | Phụ thuộc | Deadline    | Trạng thái | Điều kiện xong                                              |
| --- | ------------------------------------------------------------------------------- | --------: | --------- | ----------- | ---------- | ----------------------------------------------------------- |
| T01 | Đổi UI content/status thành title/description/completed; form và danh sách demo |        1h | A04       | 16/10 12:00 | Chưa làm   | UI dùng đúng fields; xác định loading/empty/error           |
| T02 | Tạo Todo router/controller/service/repository/validation; gắn requireAuth       |        1h | A02, A04  | 16/10 15:00 | Chưa làm   | Toàn bộ /api/todos bắt đăng nhập; không lấy user_id từ body |
| T03 | Làm POST /todos và GET /todos theo user                                         |      1.5h | T02       | 16/10 18:00 | Chưa làm   | Tạo 201, list 200; user B không thấy Todo A                 |
| T04 | Nối UI với hai API; xử lý submit lặp, 401, lỗi và reload trang                  |        1h | T01, T03  | 16/10 20:00 | Chưa làm   | Bỏ dataDemo khỏi luồng thật; F5 vẫn thấy dữ liệu đã lưu     |
| T05 | Lưu kết quả kiểm tra và commit luồng list/create                                |      0.5h | T04       | 16/10 21:00 | Chưa làm   | Có ghi chú request/response và commit chạy được             |

### 17/10 — chi tiết, sửa, hoàn thành, xóa (5 giờ)

| ID  | Task                                                | Ước lượng | Phụ thuộc | Deadline    | Trạng thái | Điều kiện xong                                                                 |
| --- | --------------------------------------------------- | --------: | --------- | ----------- | ---------- | ------------------------------------------------------------------------------ |
| T06 | Làm UI chi tiết, lưu/hủy chỉnh sửa và xác nhận xóa  |        1h | T04       | 17/10 12:00 | Chưa làm   | UI đủ thao tác, state không sửa trực tiếp object cũ                            |
| T07 | GET /todos/:id và PATCH title/description/completed |      1.5h | T03       | 17/10 16:00 | Chưa làm   | Query theo id + user_id; 404 khi không thuộc user; PATCH rỗng/sai kiểu bị chặn |
| T08 | DELETE /todos/:id và nối các thao tác UI            |        1h | T06, T07  | 17/10 18:00 | Chưa làm   | Xóa trả 204; frontend không gọi json() cho 204; UI cập nhật đúng               |
| T09 | Test hai tài khoản với đọc/sửa/xóa ID của nhau      |        1h | T08       | 17/10 20:00 | Chưa làm   | Tất cả bị chặn; Todo của chủ sở hữu không bị thay đổi                          |
| T10 | Demo CRUD ngắn, cập nhật docs và commit             |      0.5h | T09       | 17/10 21:00 | Chưa làm   | Demo từ login tới CRUD có dữ liệu MySQL                                        |

### 18/10 — phân trang và độ ổn định UI (4 giờ)

| ID  | Task                                                               | Ước lượng | Phụ thuộc     | Deadline    | Trạng thái | Điều kiện xong                                                             |
| --- | ------------------------------------------------------------------ | --------: | ------------- | ----------- | ---------- | -------------------------------------------------------------------------- |
| P01 | Làm UI trang trước/sau và trạng thái hiện tại                      |      0.5h | T04           | 18/10 12:00 | Chưa làm   | Có page/pageSize và trạng thái vô hiệu nút                                 |
| P02 | Backend validate page/pageSize, COUNT và LIMIT/OFFSET              |      1.5h | T03           | 18/10 16:00 | Chưa làm   | Total chỉ của user; ORDER BY created_at DESC, id DESC; pageSize tối đa 100 |
| P03 | Nối UI; xử lý response cũ, trang rỗng và xóa item cuối trang       |        1h | P01, P02, T08 | 18/10 19:00 | Chưa làm   | Đổi trang nhanh không ghi đè dữ liệu sai; không kẹt trang cuối rỗng        |
| P04 | Kiểm tra với hơn 2 trang dữ liệu, đọc EXPLAIN và xin mentor review |        1h | P03           | 18/10 21:00 | Chưa làm   | Có ví dụ paging và giải thích được index; ghi nhận góp ý                   |

### 19/10 — caching (5 giờ)

| ID  | Task                                                             | Ước lượng | Phụ thuộc | Deadline    | Trạng thái | Điều kiện xong                                                                           |
| --- | ---------------------------------------------------------------- | --------: | --------- | ----------- | ---------- | ---------------------------------------------------------------------------------------- |
| C01 | Tự học cache-aside/TTL/invalidation, ghi phương án và chạy Redis |        1h | T10       | 19/10 12:00 | Chưa làm   | Chốt cache GET chi tiết; key chứa userId + todoId; TTL 60s                               |
| C02 | Implement cache hit/miss cho GET /todos/:id                      |      1.5h | C01, T07  | 19/10 16:00 | Chưa làm   | Request đầu đọc DB, lần sau hit cache; không cache password/hash                         |
| C03 | Xóa key sau PATCH/DELETE; fallback DB khi Redis lỗi              |        1h | C02, T08  | 19/10 18:00 | Chưa làm   | Mutation rồi đọc không nhận dữ liệu cũ trong luồng tuần tự; Redis lỗi không treo request |
| C04 | Test TTL, quyền user khác, Redis tắt; ghi bằng chứng             |        1h | C03       | 19/10 20:00 | Chưa làm   | Có log hit/miss; user B không nhận cache của A                                           |
| C05 | Demo caching và nhờ mentor review cách apply                     |      0.5h | C04       | 19/10 21:00 | Chưa làm   | Giải thích được lợi ích, chi phí và giới hạn nhất quán                                   |

### 20/10 — Docker (5 giờ)

Kiểm tra Docker Desktop/Engine có chạy được ngay trong task A04 ngày 15/10; nếu bị chặn cài đặt/quyền, nhờ mentor hỗ trợ sớm.

| ID  | Task                                                      | Ước lượng | Phụ thuộc | Deadline    | Trạng thái | Điều kiện xong                                                                        |
| --- | --------------------------------------------------------- | --------: | --------- | ----------- | ---------- | ------------------------------------------------------------------------------------- |
| D01 | Dockerfile backend, .dockerignore và cấu hình env         |        1h | C04       | 20/10 12:00 | Chưa làm   | Backend chạy bằng node; secret không nằm trong image                                  |
| D02 | Build frontend + Nginx, proxy /api và fallback SPA        |        1h | T10       | 20/10 15:00 | Chưa làm   | Refresh /login, /register, /todos không bị 404 server                                 |
| D03 | Compose frontend/backend/MySQL/Redis; volume, healthcheck |      1.5h | D01, D02  | 20/10 18:00 | Chưa làm   | Service name đúng; database ready; không phụ thuộc MySQL host                         |
| D04 | Chạy migration 001 rồi 002 trên DB sạch; test restart     |        1h | D03       | 20/10 20:00 | Chưa làm   | Có cách chạy migration được ghi lại; restart giữ dữ liệu; tránh chạy lại 002 mù quáng |
| D05 | Ghi hướng dẫn Compose, demo và commit                     |      0.5h | D04       | 20/10 21:00 | Chưa làm   | Người khác biết cấu hình, start, migration, log, stop                                 |

### 21/10 — kiểm thử và sửa lỗi (4 giờ)

| ID  | Task                                                            | Ước lượng | Phụ thuộc | Deadline    | Trạng thái | Điều kiện xong                                                             |
| --- | --------------------------------------------------------------- | --------: | --------- | ----------- | ---------- | -------------------------------------------------------------------------- |
| Q01 | Tạo môi trường test riêng và test auth/quyền sở hữu tự động     |      1.5h | T09, D04  | 21/10 15:00 | Chưa làm   | Không có cookie/token sai bị 401; A không đọc/sửa/xóa B; không xóa DB demo |
| Q02 | Test validation, paging và cache tự động ở các nhánh quan trọng |        1h | P04, C04  | 21/10 18:00 | Chưa làm   | Lệnh test thật chạy được; invalidation và lỗi đầu vào có kiểm tra          |
| Q03 | Chạy browser flow, build/lint/test; sửa lỗi chặn demo           |      1.5h | Q01, Q02  | 21/10 21:00 | Chưa làm   | Có bằng chứng pass/fail; lỗi còn lại được ghi rõ                           |

### 22/10 — tài liệu, môi trường sạch và demo thử (4 giờ + 2 giờ dự phòng)

| ID  | Task                                                       | Ước lượng | Phụ thuộc      | Deadline    | Trạng thái | Điều kiện xong                                                               |
| --- | ---------------------------------------------------------- | --------: | -------------- | ----------- | ---------- | ---------------------------------------------------------------------------- |
| R01 | README, .env.example, API và architecture khớp source cuối |        1h | D05, Q03       | 22/10 12:00 | Chưa làm   | Không còn docs mô tả Bearer token/UUID sai với code                          |
| R02 | Clone vào thư mục khác và chạy đúng README với DB riêng    |        1h | R01            | 22/10 15:00 | Chưa làm   | Không cần file env/DB/Redis sẵn từ máy phát triển                            |
| R03 | Demo thử 10–15 phút với mentor, hỏi điểm cần sửa           |      0.5h | R02            | 22/10 17:00 | Chưa làm   | Có góp ý cụ thể; xác nhận giờ demo 23/10                                     |
| R04 | Sửa lỗi cuối, luyện Q&A và chốt commit nộp                 |      1.5h | R03            | 22/10 19:00 | Chưa làm   | Giải thích được auth/SQL/index/paging/cache/Docker; không thêm chức năng lớn |
| B01 | Dự phòng lỗi phát sinh hoặc phản hồi mentor                |        2h | Theo phát sinh | 22/10 21:00 | Chưa dùng  | Nếu không phát sinh thì nghỉ/kiểm tra demo; không tự mở scope                |

### 23/10 — bàn giao (1 giờ, chưa gồm thời gian mentor đánh giá)

| ID  | Task                                                                 | Ước lượng | Phụ thuộc | Deadline                        | Trạng thái | Điều kiện xong                                       |
| --- | -------------------------------------------------------------------- | --------: | --------- | ------------------------------- | ---------- | ---------------------------------------------------- |
| H01 | Kiểm tra link GitHub, quyền mentor, commit, cấu hình và dữ liệu demo |      0.5h | R04       | 23/10 09:00 (nội bộ)            | Chưa làm   | Mentor mở source được; không có secret; app sẵn sàng |
| H02 | Gửi link repo/commit và demo                                         |      0.5h | H01       | 23/10, theo giờ mentor xác nhận | Chưa làm   | Đã bàn giao và demo; ghi hạn chế còn lại trung thực  |

Nếu giờ mentor hẹn sớm hơn mốc nội bộ, chuyển H01 và chuẩn bị dữ liệu sang tối 22/10.

## 5. Mốc review và hỗ trợ từ mentor

| Mốc   | Nội dung gửi/xin review                           | Cần chuẩn bị trước                                             |
| ----- | ------------------------------------------------- | -------------------------------------------------------------- |
| 15/10 | Timeline có phù hợp không? Review auth và 3-layer | Demo login/F5/logout, diagram request, danh sách chỗ chưa hiểu |
| 18/10 | Review CRUD, quyền sở hữu, paging và index        | Hai tài khoản, ví dụ ID của user khác, EXPLAIN                 |
| 19/10 | Review cách apply caching                         | Log miss/hit, TTL, đọc sau sửa/xóa, khi Redis tắt              |
| 22/10 | Demo thử và chốt bàn giao                         | Chạy từ clone sạch, README, test report, hạn chế hiện tại      |

Nếu mentor bận, gửi câu hỏi kèm code/commit và tiếp tục task độc lập. Không coi chưa được review là hoàn thành; ghi “Chờ review”.

## 6. Quy tắc xử lý chậm tiến độ

- Kẹt một vấn đề hơn 45–60 phút: ghi hiện tượng, log không chứa secret, điều đã thử, giả thuyết; nhờ mentor giúp đúng điểm đó.
- Cuối 17/10 chưa xong CRUD: bỏ toàn bộ phần tùy chọn và báo mentor; không âm thầm dồn Docker/test sang ngày nộp.
- Cuối 19/10 chưa có cache demo: nhờ review trực tiếp, giữ phạm vi chỉ cache chi tiết, không cache toàn bộ danh sách.
- Hết 20/10 chưa chạy được Compose: ưu tiên Docker và khởi chạy sạch; báo rủi ro bàn giao ngay.
- Không cắt quyền truy cập, validation backend, paging, caching hoặc Docker vì đây là yêu cầu đề. Nếu không thể hoàn thành, trao đổi phạm vi với mentor trước.
- Sau 22/10 19:00 chỉ sửa lỗi ảnh hưởng demo/bàn giao.

## 7. Định nghĩa hoàn thành và bằng chứng

Kịch bản use case và biểu đồ tuần tự theo dõi tại [sequence-diagrams.md](sequence-diagrams.md). A04/T10/R01 cần cập nhật diagram tương ứng khi chốt hoặc thay đổi luồng; không coi có diagram là đã kiểm thử.

Một task chỉ “Xong” khi code chạy được, đã kiểm tra điều kiện xong, người thực hiện hiểu code và ghi bằng chứng. Bằng chứng có thể là commit, request/response đã che thông tin nhạy cảm, kết quả test hoặc ghi chú demo. Có file hoặc build pass chưa đủ chứng minh nghiệp vụ đúng.

Trạng thái dùng thống nhất: Chưa làm → Đang làm → Chờ kiểm tra/review → Xong; nếu bị cản thì ghi Bị chặn và nguyên nhân.

| Task ID | Bằng chứng/commit | Kết quả kiểm tra                              | Ngày hoàn thành thực tế | Vấn đề cần mentor hỗ trợ |
| ------- | ----------------- | --------------------------------------------- | ----------------------- | ------------------------ |
| A01     | Chưa có           | Chưa chạy nghiệm thu trong lượt cập nhật docs | —                       | —                        |

## 8. Mẫu cập nhật cuối ngày

```text
Ngày:
Task xong (ID + bằng chứng):
Task đang làm và dự kiến xong:
Task trễ và ảnh hưởng mốc nào:
Vấn đề đã thử xử lý:
Cần mentor hỗ trợ cụ thể:
Ba việc tiếp theo:
```

Giữ tài liệu này trong GitHub để mentor theo dõi. Timeline là nguồn deadline chính; API contract ở api.md và cách chia source ở architecture.md.
