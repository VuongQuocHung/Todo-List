# Todo App — Tiến độ và kế hoạch hoàn thiện

Cập nhật **21/10/2026**, theo source local gồm thay đổi chưa commit. Deadline kế hoạch ban đầu: **23/10/2026**, giờ Việt Nam; chưa xác nhận giờ demo hoặc đã bàn giao.

## 1. Cách đọc trạng thái

- **Có code**: có implementation trong source được rà soát.
- **Cần kiểm chứng**: chưa có kết quả thực thi/bằng chứng trong lần cập nhật này.
- **Chưa triển khai**: chưa có implementation tương ứng.
- **Đã nghiệm thu**: chỉ dùng sau khi chạy kiểm tra và ghi bằng chứng.

Không dùng checkbox cũ làm bằng chứng tiến độ hiện tại; có commit/file không đồng nghĩa đã test pass.

## 2. Hiện trạng

| Hạng mục | Triển khai | Kiểm chứng còn cần |
| --- | --- | --- |
| React SPA/Router, Home/Auth/Todo UI | Có code | Browser flow và responsive |
| Express controller–service–repository | Có code | Request thành công/lỗi xuyên các lớp |
| MySQL và migration | Có 001_init.sql, users/todos/tags/todo_tags | Khởi tạo sạch, ràng buộc và restart |
| Register/login/JWT cookie | Có code | 201/400/401/409, hash, cookie theo môi trường |
| /me và logout | Có code; AbortController, xóa SWR cache | F5, hết phiên, abort, logout 204, đổi tài khoản |
| ProtectedRoute/chờ auth trước Todo | Chưa triển khai riêng | Bổ sung và kiểm thử |
| CRUD API, ownership | Có code, lọc id + user_id | Hai tài khoản, kể cả cache đã có |
| UI CRUD | Đã nối API; không còn Todo mẫu trong luồng quản lý | CRUD, lỗi mạng, submit lặp |
| API chi tiết | Có code và cache | Test bằng API; chưa có màn hình chi tiết riêng |
| Hạn/ngày hoàn thành/quá hạn | Có code | Mốc ngày VN, hoàn thành trễ, bỏ hoàn thành |
| Search/filter/paging/stats | Có code, frontend 5 item/trang | Query/URL, tổng tab, trang vượt giới hạn |
| Redis | Cache cả list/detail, version, TTL, fallback | Hit/miss, invalidation, quyền, Redis lỗi/reconnect |
| Refactor frontend | Hooks/API/components, SWR, memo/useCallback | Hồi quy, profiler, keepPreviousData/loading |
| Docker | Bốn service, Nginx, healthcheck, volume, dev override | Môi trường sạch, cookie, migration, log |
| Test tự động | Chưa có suite thực tế | Backend test script vẫn placeholder |
| Tags | Có schema, chưa có API/UI | Phần mở rộng, không tính là feature hoàn chỉnh |
| Admin/share/refresh token/CI/CD/cloud | Chưa triển khai | Ngoài phạm vi hiện tại |

## 3. Kế hoạch ban đầu và điều chỉnh

Kế hoạch cũ chia chặng auth → CRUD → paging → cache → Docker → kiểm thử → tài liệu/demo trong 15–23/10. Ước lượng 37 giờ và 2 giờ dự phòng là dữ liệu lập kế hoạch, không phải thời gian thực tế đã làm.

Source hiện đã vượt nhiều trạng thái “chưa làm” của bản ngày 15/10. Chặng tiếp theo cần tập trung nghiệm thu và sửa các vấn đề ảnh hưởng bàn giao. Không suy ra ngày hoàn thành thực tế của từng task từ ngày dự kiến.

## 4. Việc còn lại theo thứ tự ưu tiên

Các mốc dưới đây là **đề xuất**, không phải lịch mentor đã xác nhận.

| Mốc đề xuất | Công việc | Điều kiện kết thúc |
| --- | --- | --- |
| 21/10 | Test API auth/ownership/validation và sửa lỗi chặn demo | Có kết quả, request/response đã che secret |
| 21–22/10 | Test paging, ngày nghiệp vụ, cache/SWR, Redis gián đoạn | Có bằng chứng và giới hạn còn lại |
| 22/10 | Browser flow, chờ auth/route, đổi tài khoản, loading | Kiểm thử các nhánh sau thay đổi |
| 22/10 | Chạy README từ môi trường riêng; kiểm tra cookie, migration, restart | Mentor có thể làm theo các bước |
| 22/10 | Chạy lint/build, ghi kết quả; dọn log; bổ sung test tự động ưu tiên | Ghi pass/fail thật, không thay bằng checkbox có code |
| 22/10 | Chốt báo cáo, ảnh demo, commit/repo, luyện Q&A | Tài liệu khớp source bàn giao |
| 23/10 | Kiểm tra cuối và demo theo giờ xác nhận | Ghi kết quả bàn giao, góp ý và việc còn lại |

Nếu thiếu thời gian, trao đổi phạm vi với mentor; ưu tiên quyền sở hữu, tính đúng dữ liệu, khả năng khởi chạy và bằng chứng hơn mở rộng tính năng.

## 5. Ma trận nghiệm thu

| ID | Tình huống | Kết quả mong đợi | Kết quả thực tế/bằng chứng |
| --- | --- | --- | --- |
| AUTH-01 | Register hợp lệ/trùng/sai | 201/409/400; DB chỉ lưu hash | Chưa ghi nhận |
| AUTH-02 | Login/F5/logout | Cookie, /me, Context đúng; 204 không parse JSON | Chưa ghi nhận |
| AUTH-03 | Không token, token sai/hết hạn | Todo API 401; frontend xử lý hết phiên | Chưa ghi nhận |
| OWN-01 | B đọc/sửa/xóa Todo A | 404; dữ liệu A không đổi | Chưa ghi nhận |
| OWN-02 | Lặp OWN-01 khi A đã tạo cache | Không lấy dữ liệu cache của A | Chưa ghi nhận |
| TODO-01 | CRUD, PATCH rỗng, field lạ | Response/DB đúng; dữ liệu sai bị 400 | Chưa ghi nhận |
| DATE-01 | Quá hạn, hoàn thành trễ, bỏ hoàn thành | Ngày VN và bộ lọc đúng | Chưa ghi nhận |
| PAGE-01 | Nhiều trang, search/filter | totalItems/stats, sort, URL đúng | Chưa ghi nhận |
| PAGE-02 | Xóa/sửa item cuối trang cuối | Chuyển trang hợp lệ | Chưa ghi nhận |
| CACHE-01 | Đọc lặp, mutation, hết TTL | Miss/hit/invalidation đúng luồng tuần tự | Chưa ghi nhận |
| CACHE-02 | Redis gián đoạn rồi nối lại | Fallback DB; kiểm tra dữ liệu cũ khi reconnect | Chưa ghi nhận |
| FE-01 | Logout A/login B, đổi query nhanh | Không lẫn dữ liệu user/query, loading phù hợp | Chưa ghi nhận |
| FE-02 | Timeout, abort, backend lỗi | Banner/toast và khả năng phục hồi phù hợp | Chưa ghi nhận |
| DOCKER-01 | Init sạch, restart, F5 route SPA | Schema có đủ; DB giữ dữ liệu; route hoạt động | Chưa ghi nhận |
| CHECK-01 | Lint/build/test thực tế | Ghi riêng kết quả từng lệnh | Chưa chạy trong lần cập nhật này |

Test tự động cần DB/Redis riêng, không xóa dữ liệu demo. Cache log chỉ có khi backend development. Healthcheck pass không thay thế nghiệm thu nghiệp vụ.

## 6. Mẫu ghi bằng chứng

```text
Ngày / người kiểm tra:
Commit hoặc trạng thái working tree:
Môi trường và cấu hình chạy:
Case / lệnh:
Kết quả mong đợi:
Kết quả thực tế:
Bằng chứng (log/ảnh/request đã che secret):
Lỗi còn lại và bước tiếp theo:
```

[Báo cáo tổng hợp](TodoApp.md) · [API](api.md) · [Refactor](refactor-plan.md)
