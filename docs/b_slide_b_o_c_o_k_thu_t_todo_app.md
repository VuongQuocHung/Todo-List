# BỘ SLIDE BÁO CÁO KỸ THUẬT: TODO APP (24 SLIDE CHI TIẾT TỪNG THAO TÁC)

> **Lưu ý sử dụng tài liệu:** Tài liệu này đồng bộ 100% với 24 slide trình chiếu trong file `todo_app_presentation.html`. Mỗi thao tác của người dùng và mỗi cơ chế kỹ thuật đều được tách thành **một slide riêng biệt**. Với từng slide bên dưới, bạn có đầy đủ 4 mục:
> 1. **Nội dung hiển thị trên slide** (ngắn gọn, đúng chuẩn 16:9).
> 2. **Hình / sơ đồ nên sử dụng** (ưu tiên sơ đồ mức phân tích: `Người dùng → Giao diện → Hệ thống → Kết quả` cho các slide tính năng).
> 3. **Ghi chú lời nói của người thuyết trình (30–45 giây)** viết theo giọng tự nhiên của thực tập sinh báo cáo với mentor.
> 4. **Phần cần bổ sung bằng chứng hoặc ảnh nếu đang thiếu.**

---

## SLIDE 1 — Giới thiệu dự án

* **Nội dung hiển thị:**
  * **Tiêu đề:** Todo App — Quản Lý Công Việc Cá Nhân
  * **Câu mô tả ứng dụng:** Ứng dụng web giúp người dùng quản lý công việc riêng theo từng tài khoản, hỗ trợ theo dõi hạn hoàn thành, tìm kiếm, lọc và phân trang.
  * **Người thực hiện:** `[Họ tên thực tập sinh]` | **Mentor hướng dẫn:** `[Tên mentor]`
  * **Mục tiêu của bài thực tập:** Nắm vững quy trình xây dựng ứng dụng full-stack từ giao diện React SPA, thiết kế REST API phân lớp với Express, quản lý dữ liệu MySQL, kết hợp bộ nhớ đệm SWR/Redis đến đóng gói bằng Docker Compose.
* **Hình / sơ đồ nên sử dụng:**
  * Bố cục trang bìa kèm ảnh chụp tổng thể màn hình chính của ứng dụng Todo App.
* **Ghi chú lời nói của người thuyết trình (35 giây):**
  > "Em chào anh/chị `[Tên mentor]`. Hôm nay em xin báo cáo kết quả thực hiện dự án Todo App trong kỳ thực tập. Đây là ứng dụng giúp mỗi cá nhân quản lý danh sách công việc theo tài khoản riêng, có theo dõi hạn hoàn thành, tìm kiếm, lọc và phân trang. Qua dự án này, mục tiêu của em là hiểu và tự triển khai được trọn vẹn một luồng xử lý từ giao diện React, đi qua API Express phân lớp, lưu trữ MySQL, kết hợp SWR ở frontend, Redis ở backend và đóng gói bằng Docker Compose."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * Điền tên thật của người trình bày, tên mentor và chèn 1 ảnh chụp màn hình tổng quan giao diện ứng dụng.

---

## SLIDE 2 — Phạm vi và tiến độ

* **Nội dung hiển thị:**
  * **Tiêu đề:** Phạm Vi Và Tiến Độ Thực Hiện
  * **Câu tóm tắt:** Phân biệt rõ phần đã có trong source code, phần đang hoàn thiện và các hạng mục dự kiến mở rộng.
  * **1. Đã có code trong source:**
    * Tài khoản: Đăng ký, đăng nhập, khôi phục phiên qua `/auth/me`, đăng xuất.
    * Công việc: Tạo mới, xem danh sách, chỉnh sửa, xóa, đánh dấu hoàn thành, tính quá hạn.
    * Tra cứu & Hạ tầng: Tìm kiếm theo tiêu đề, lọc 4 tab, phân trang, thống kê, SWR, Redis cache và Docker Compose.
  * **2. Đang hoàn thiện & kiểm chứng:**
    * Chạy kiểm thử thực tế từng luồng và thu thập ảnh chụp/log bằng chứng.
    * Đồng bộ `httpClient` cho trang Login/Register, bổ sung `ProtectedRoute` và thêm `userId` vào SWR key.
  * **3. Dự kiến mở rộng (chưa hoàn thành trong source):**
    * Quản lý nhãn công việc (`tags` và `todo_tags` hiện mới có bảng SQL, chưa có API/UI).
    * Sắp xếp công việc tùy chọn theo tên/ngày trên giao diện (hiện backend đang sắp xếp mặc định theo thời gian tạo mới nhất).
    * Trang xem chi tiết Todo riêng và bộ test tự động.
* **Hình / sơ đồ nên sử dụng:**
  * Bảng 3 cột phân loại trạng thái: `Đã có code` (Xanh lá) — `Đang hoàn thiện` (Vàng cam) — `Dự kiến` (Xanh dương).
* **Ghi chú lời nói của người thuyết trình (40 giây):**
  > "Ở slide thứ hai, em xin làm rõ phạm vi và tiến độ thực tế dựa trên mã nguồn hiện tại. Những chức năng cốt lõi như đăng ký, đăng nhập, thêm-sửa-xóa công việc, tìm kiếm, lọc, phân trang, SWR, Redis và Docker đều đã có code đầy đủ. Tuy nhiên, em tách riêng phần đang hoàn thiện là việc thu thập bằng chứng kiểm thử và bổ sung `ProtectedRoute`. Còn các phần như gắn nhãn `tags`, chọn kiểu sắp xếp theo tên hay ngày trên giao diện, và trang chi tiết riêng thì mới dừng ở thiết kế schema hoặc dự kiến mở rộng."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * Cập nhật lại trạng thái từ "Đã có code" sang "Đã kiểm thử" cho từng mục sau khi chạy test thực tế.

---

## SLIDE 3 — Tổng quan hệ thống

* **Nội dung hiển thị:**
  * **Tiêu đề:** Tổng Quan Hệ Thống
  * **Câu tóm tắt:** Mô hình kết nối từ trình duyệt qua Nginx đến Express, MySQL và Redis trong mạng Docker Compose.
  * **Ý chính:**
    * **Frontend (Trình duyệt):** Chạy ứng dụng React SPA, dùng React Router điều hướng và **SWR nằm ở phía frontend** để quản lý dữ liệu tải từ API.
    * **Nginx (`:8080`):** Phục vụ bộ file tĩnh sau khi build của React và chuyển tiếp các request `/api` sang Backend.
    * **Backend (Express `:3000`):** Tổ chức theo `route → middleware/validation → controller → service → repository` để kiểm tra quyền và xử lý nghiệp vụ.
    * **MySQL & Redis:** MySQL lưu trữ dữ liệu gốc lâu dài; **Redis nằm ở phía backend** để lưu tạm kết quả đọc nhằm giảm truy vấn lặp xuống MySQL.
* **Hình / sơ đồ nên sử dụng:**
  * Sơ đồ khối ngang: `Trình duyệt (React + SWR)` ➔ `Nginx (:8080)` ➔ `Express (:3000)` ➔ `MySQL` & `Redis`.
* **Ghi chú lời nói của người thuyết trình (40 giây):**
  > "Đây là bức tranh tổng quan của hệ thống khi chạy trên Docker. Người dùng truy cập ứng dụng qua cổng 8080 của Nginx. Nginx vừa trả file giao diện React, vừa chuyển tiếp các đường dẫn `/api` vào Express ở cổng 3000. Ở đây em xin nhấn mạnh vị trí của hai lớp cache để tránh nhầm lẫn: SWR nằm hoàn toàn ở phía trình duyệt để quản lý dữ liệu hiển thị, còn Redis nằm ở phía backend để lưu đệm kết quả đọc trước khi chạm tới MySQL. Từ slide sau, em xin đi vào từng thao tác cụ thể."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * Có thể dùng sơ đồ khối có sẵn trên Slide 3 (không thiếu dữ liệu).

---

## SLIDE 4 — Đăng ký

* **Nội dung hiển thị:**
  * **Tiêu đề:** Đăng Ký Tài Khoản
  * **Câu mô tả người dùng làm được gì:** Người dùng tạo tài khoản mới bằng username, họ tên tùy chọn, email và mật khẩu để có không gian quản lý công việc riêng.
  * **Ý chính:**
    * Nhập `username`, `fullname` (không bắt buộc), `email`, `password` và xác nhận mật khẩu (`confirmPassword` kiểm tra ở frontend).
    * Backend dùng Zod kiểm tra định dạng dữ liệu; mật khẩu từ 8 đến 72 ký tự và không vượt quá 72 byte UTF-8.
    * Kiểm tra trùng `username` và `email` trong MySQL; nếu trùng trả mã lỗi `409 Conflict`.
    * Băm mật khẩu bằng `bcrypt` (cost 10), lưu tài khoản mới và trả về `201 Created` (hoặc báo lỗi trên form).
* **Hình / sơ đồ nên sử dụng:**
  * Ảnh chụp giao diện form đăng ký (`RegisterPage`) đặt cạnh sơ đồ phân tích:
    `Người dùng nhập thông tin` ➔ `Giao diện kiểm tra mật khẩu khớp` ➔ `Hệ thống kiểm tra trùng & tạo tài khoản` ➔ `Kết quả báo thành công (201) hoặc lỗi (400/409)`.
* **Ghi chú lời nói của người thuyết trình (35 giây):**
  > "Đầu tiên là thao tác đăng ký tài khoản. Người dùng nhập username, email, mật khẩu và có thể nhập thêm họ tên. Ở phía giao diện, em kiểm tra mật khẩu xác nhận phải khớp nhau trước khi gửi đi. Khi request lên tới backend, hệ thống kiểm tra định dạng bằng Zod và kiểm tra xem username hoặc email đã tồn tại trong MySQL chưa. Nếu chưa trùng, mật khẩu được băm bằng bcrypt rồi lưu vào database, trả về mã 201 và xóa trắng form để người dùng chuyển sang đăng nhập."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Thiếu ảnh giao diện:** Cần chụp ảnh màn hình trang `/register` khi điền form và khi báo đăng ký thành công (hoặc có thể tham khảo sơ đồ `docs/AuthService User Registration Flow-*.png` trong repo).

---

## SLIDE 5 — Đăng nhập

* **Nội dung hiển thị:**
  * **Tiêu đề:** Đăng Nhập
  * **Câu mô tả người dùng làm được gì:** Người dùng nhập email và mật khẩu để xác thực danh tính và truy cập vào danh sách công việc cá nhân.
  * **Ý chính:**
    * Người dùng nhập `email` và `password` tại trang `/login`.
    * Backend chuẩn hóa email, tìm tài khoản trong MySQL và kiểm tra mật khẩu bằng `bcrypt.compare`.
    * Nếu hợp lệ, backend tạo JWT (thời hạn 1 ngày) và gắn vào cookie `HttpOnly` (`SameSite=Lax`), không trả token trong JSON body.
    * Frontend lưu thông tin `user` vào `AuthContext` và chuyển hướng người dùng sang trang `/todos`.
* **Hình / sơ đồ nên sử dụng:**
  * Sơ đồ luồng 4 bước: `Người dùng nhập email/mật khẩu` ➔ `Giao diện gửi POST /api/auth/login` ➔ `Hệ thống đối chiếu & gắn HttpOnly Cookie` ➔ `Kết quả cập nhật user và vào trang /todos`.
* **Ghi chú lời nói của người thuyết trình (35 giây):**
  > "Tiếp theo là thao tác đăng nhập. Người dùng chỉ cần nhập email và mật khẩu. Backend sẽ tìm tài khoản theo email và dùng bcrypt để so khớp mật khẩu. Điểm quan trọng ở bước này là khi đăng nhập thành công, backend không trả chuỗi JWT ra JSON để lưu vào localStorage, mà thiết lập trực tiếp vào HttpOnly Cookie có thời hạn một ngày. Phía frontend nhận về thông tin cơ bản của user, cập nhật vào AuthContext rồi chuyển người dùng vào trang quản lý công việc."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Thiếu ảnh giao diện:** Cần bổ sung ảnh chụp màn hình trang `/login` (lưu ý làm mờ hoặc không chụp giá trị cookie/token thật).

---

## SLIDE 6 — Khôi phục trạng thái đăng nhập

* **Nội dung hiển thị:**
  * **Tiêu đề:** Khôi Phục Trạng Thái Đăng Nhập Khi F5
  * **Câu mô tả người dùng làm được gì:** Người dùng tải lại trang (F5) mà không bị mất trạng thái đăng nhập nếu phiên làm việc trong cookie vẫn còn hạn.
  * **Ý chính:**
    * Khi nhấn F5, dữ liệu `user` lưu trong bộ nhớ React Context bị mất, nhưng cookie `HttpOnly` vẫn được trình duyệt giữ lại.
    * `AuthProvider` tự động gọi `GET /api/auth/me` ngay khi ứng dụng khởi chạy (có dùng `AbortController` hủy request nếu component unmount).
    * Backend đọc cookie, xác minh JWT và trả lại thông tin người dùng hiện tại (`Cache-Control: no-store`).
    * Thanh Header dựa vào kết quả này để hiển thị tên người dùng hoặc nút Đăng nhập.
* **Hình / sơ đồ nên sử dụng:**
  * Sơ đồ luồng: `Người dùng nhấn F5` ➔ `Giao diện (AuthProvider) gọi /api/auth/me` ➔ `Hệ thống kiểm tra cookie phiên` ➔ `Kết quả Header hiển thị tên user hoặc nút Đăng nhập`.
* **Ghi chú lời nói của người thuyết trình (35 giây):**
  > "Vì thông tin user ở frontend chỉ lưu trong state của React Context chứ không lưu dưới localStorage, nên khi người dùng nhấn F5 thì state này sẽ bị xóa. Để khôi phục lại trạng thái đăng nhập, component `AuthProvider` sẽ tự động gọi API `/api/auth/me` ngay khi tải trang. Trình duyệt tự gửi kèm cookie đăng nhập lên server; nếu cookie còn hợp lệ, backend trả về thông tin user để thanh Header hiển thị đúng tên người đang đăng nhập."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Thiếu ảnh minh họa:** Cần chụp ảnh thanh Header hiển thị tên user kèm tab Network gọi `GET /api/auth/me` trả về `200`.

---

## SLIDE 7 — Đăng xuất

* **Nội dung hiển thị:**
  * **Tiêu đề:** Đăng Xuất
  * **Câu mô tả người dùng làm được gì:** Người dùng kết thúc phiên làm việc trên trình duyệt và xóa toàn bộ dữ liệu công việc đang lưu tạm ở giao diện.
  * **Ý chính:**
    * Người dùng bấm nút **Đăng xuất** trên thanh Header.
    * Backend nhận `POST /api/auth/logout`, thực hiện xóa cookie `token` và trả về mã `204 No Content`.
    * Frontend xóa thông tin `user` trong `AuthContext` và xóa sạch cache của SWR.
    * Ứng dụng chuyển về trang chủ; lưu ý hiện tại backend chỉ xóa cookie chứ chưa có cơ chế thu hồi (blacklist) JWT ở phía server.
* **Hình / sơ đồ nên sử dụng:**
  * Sơ đồ 4 khối ngang: `Người dùng bấm Đăng xuất` ➔ `Giao diện gọi API & dọn cache SWR` ➔ `Hệ thống xóa cookie đăng nhập` ➔ `Kết quả quay về trang chủ`.
* **Ghi chú lời nói của người thuyết trình (35 giây):**
  > "Khi người dùng bấm Đăng xuất trên Header, frontend gọi API `/api/auth/logout` để backend xóa cookie đăng nhập và trả về mã 204. Đồng thời ở phía trình duyệt, em xóa thông tin user trong Context và gọi hàm xóa toàn bộ cache của SWR để nếu có tài khoản khác đăng nhập ngay sau đó thì sẽ không nhìn thấy dữ liệu cũ. Em cũng xin nói rõ giới hạn hiện tại là server mới chỉ xóa cookie trên trình duyệt chứ chưa có cơ chế blacklist để thu hồi token phía server."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Thiếu bằng chứng:** Cần chụp ảnh giao diện sau khi đăng xuất quay về trang chủ và request `POST /api/auth/logout` trả về `204`.

---

## SLIDE 8 — Tạo công việc

* **Nội dung hiển thị:**
  * **Tiêu đề:** Tạo Công Việc Mới
  * **Câu mô tả người dùng làm được gì:** Người dùng nhập tiêu đề công việc cùng mô tả và hạn hoàn thành tùy chọn để lưu công việc mới vào danh sách cá nhân.
  * **Ý chính:**
    * Nhập `title` (bắt buộc, 1–200 ký tự), `description` (tùy chọn, tối đa 2.000 ký tự) và `dueDate` (tùy chọn).
    * Kiểm tra dữ liệu ở cả form frontend và middleware Zod ở backend.
    * Quyền sở hữu (`user_id`) được backend lấy trực tiếp từ phiên đăng nhập đã xác thực, không nhận từ dữ liệu gửi lên.
    * Backend lưu vào MySQL với trạng thái mặc định chưa hoàn thành (`completed = false`) và làm mới cache Redis.
    * Frontend chuyển về trang 1 và tải lại danh sách cùng bộ số liệu thống kê.
* **Hình / sơ đồ nên sử dụng:**
  * Ảnh giao diện `docs/tao-cong-viec.png` (có sẵn trong repo) kết hợp sơ đồ:
    `Người dùng nhập form` ➔ `Giao diện kiểm tra & gửi POST /api/todos` ➔ `Hệ thống gắn user_id từ phiên & lưu MySQL` ➔ `Kết quả làm mới danh sách và thống kê`.
* **Ghi chú lời nói của người thuyết trình (40 giây):**
  > "Sang nhóm chức năng quản lý công việc, thao tác đầu tiên là tạo công việc mới. Người dùng mở form, nhập tiêu đề bắt buộc, còn mô tả và ngày hạn hoàn thành là tùy chọn. Dữ liệu được kiểm tra ở cả giao diện lẫn Zod ở backend. Khi lưu vào MySQL, backend lấy `user_id` trực tiếp từ cookie phiên đăng nhập chứ không tin bất kỳ ID nào gửi từ client. Sau khi lưu thành công và tăng version cache trên Redis, frontend sẽ chuyển về trang 1 và làm mới lại cả danh sách lẫn số thống kê."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * Đã có ảnh `docs/tao-cong-viec.png` trong repo; có thể chụp thêm thông báo toast khi tạo thành công.

---

## SLIDE 9 — Xem danh sách công việc

* **Nội dung hiển thị:**
  * **Tiêu đề:** Xem Danh Sách Công Việc
  * **Câu mô tả người dùng làm được gì:** Người dùng theo dõi danh sách các công việc thuộc tài khoản của mình cùng các trạng thái hiển thị rõ ràng trên giao diện.
  * **Ý chính:**
    * Chỉ hiển thị những công việc thuộc về tài khoản đang đăng nhập (`WHERE user_id = ?`).
    * Mỗi thẻ công việc (`TodoItem`) hiển thị: tiêu đề, mô tả, hạn hoàn thành, ngày hoàn thành thực tế, nhãn trạng thái và nút sửa/xóa.
    * Giao diện xử lý đủ 3 trạng thái đặc biệt: đang tải (`TodoSkeletonList`), gặp lỗi (`TodoErrorBanner`) và khi chưa có công việc nào (`TodoEmptyState`).
* **Hình / sơ đồ nên sử dụng:**
  * Ảnh chụp danh sách công việc thực tế kèm chú thích các thành phần trên một thẻ `TodoItem`.
* **Ghi chú lời nói của người thuyết trình (35 giây):**
  > "Khi vào trang công việc, người dùng chỉ nhìn thấy các công việc thuộc về chính tài khoản của mình. Trên mỗi thẻ công việc sẽ hiển thị rõ tiêu đề, mô tả nếu có, ngày hạn, ngày hoàn thành và các nút thao tác. Ngoài danh sách chính, em cũng tách riêng các component để hiển thị hiệu ứng khung xương skeleton khi đang tải dữ liệu, khung báo lỗi khi mất kết nối, và màn hình thông báo rỗng khi người dùng chưa có công việc nào."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Thiếu ảnh giao diện:** Cần chụp ảnh màn hình danh sách công việc và ảnh màn hình khi danh sách rỗng (`TodoEmptyState`).

---

## SLIDE 10 — Chỉnh sửa công việc

* **Nội dung hiển thị:**
  * **Tiêu đề:** Chỉnh Sửa Công Việc
  * **Câu mô tả người dùng làm được gì:** Người dùng mở form sửa trực tiếp ngay tại thẻ công việc để thay đổi tiêu đề, mô tả hoặc hạn hoàn thành.
  * **Ý chính:**
    * Bấm nút Sửa trên thẻ công việc để chuyển thẻ đó sang form chỉnh sửa (`TodoEditForm`).
    * Cho phép thay đổi tiêu đề, mô tả hoặc hạn hoàn thành, sau đó chọn **Lưu** hoặc **Hủy**.
    * Backend kiểm tra quyền sở hữu (`id` và `user_id`) trước khi cập nhật vào MySQL.
    * Nếu lưu thành công, đóng form sửa và làm mới dữ liệu; nếu gặp lỗi, giữ nguyên nội dung đang sửa trên form để người dùng chỉnh lại.
* **Hình / sơ đồ nên sử dụng:**
  * Sơ đồ luồng: `Người dùng bấm Sửa & đổi nội dung` ➔ `Giao diện gửi PATCH /api/todos/:id` ➔ `Hệ thống kiểm tra quyền sở hữu & cập nhật DB` ➔ `Kết quả đóng form làm mới (hoặc giữ nội dung nếu lỗi)`.
* **Ghi chú lời nói của người thuyết trình (35 giây):**
  > "Với thao tác chỉnh sửa, thay vì chuyển sang một trang khác thì em cho mở form sửa ngay tại thẻ công việc đó. Người dùng có thể sửa lại tiêu đề, mô tả hoặc ngày hạn rồi bấm Lưu hoặc Hủy. Khi bấm Lưu, backend sẽ kiểm tra xem công việc đó có đúng là của user đang đăng nhập hay không. Nếu lưu thành công thì đóng form và tải lại danh sách mới; còn nếu có lỗi mạng hoặc lỗi dữ liệu thì form vẫn giữ nguyên nội dung người dùng vừa nhập để họ không phải gõ lại."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Thiếu ảnh giao diện:** Cần bổ sung ảnh chụp một thẻ công việc đang ở chế độ mở form chỉnh sửa (`TodoEditForm`).

---

## SLIDE 11 — Đánh dấu hoàn thành

* **Nội dung hiển thị:**
  * **Tiêu đề:** Đánh Dấu Hoàn Thành
  * **Câu mô tả người dùng làm được gì:** Người dùng bật hoặc tắt ô đánh dấu trên thẻ công việc để chuyển đổi giữa trạng thái chưa hoàn thành và đã hoàn thành.
  * **Ý chính:**
    * Chuyển đổi linh hoạt hai chiều giữa **Chưa hoàn thành (`completed = false`)** và **Đã hoàn thành (`completed = true`)**.
    * Khi chuyển từ chưa hoàn thành sang **đã hoàn thành**: Backend tự động lưu `completed_date` là ngày hiện tại theo giờ Việt Nam.
    * Khi chuyển ngược về **chưa hoàn thành**: Backend xóa `completed_date` về `NULL`.
    * Sau khi cập nhật, giao diện tự động làm mới lại danh sách công việc và các con số thống kê tiến độ.
* **Hình / sơ đồ nên sử dụng:**
  * Sơ đồ so sánh 2 nhánh chuyển trạng thái:
    * Nhánh 1: `Tick chọn Hoàn thành` ➔ `completed = true` & `completed_date = Hôm nay (UTC+7)`.
    * Nhánh 2: `Bỏ chọn Hoàn thành` ➔ `completed = false` & `completed_date = NULL`.
* **Ghi chú lời nói của người thuyết trình (35 giây):**
  > "Thao tác tiếp theo là đánh dấu hoàn thành công việc. Khi người dùng bấm tick vào ô vuông, ứng dụng gửi request PATCH để đổi trạng thái `completed`. Điểm xử lý nghiệp vụ ở backend là: khi chuyển từ chưa xong sang hoàn thành, hệ thống tự động ghi lại ngày hoàn thành thực tế `completed_date` theo múi giờ Việt Nam. Ngược lại, nếu người dùng bỏ tick để chuyển về chưa hoàn thành, backend sẽ xóa `completed_date` về null và cập nhật lại ngay thanh tiến độ."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Thiếu ảnh giao diện:** Cần chụp ảnh thẻ công việc trước và sau khi tick hoàn thành (hiển thị ngày hoàn thành).

---

## SLIDE 12 — Hạn hoàn thành và quá hạn

* **Nội dung hiển thị:**
  * **Tiêu đề:** Hạn Hoàn Thành Và Quá Hạn
  * **Câu mô tả người dùng làm được gì:** Người dùng nhận biết được công việc nào đang quá hạn hoặc đã hoàn thành nhưng trễ hạn dựa trên ngày hạn và ngày hoàn thành thực tế.
  * **Quy tắc & Bảng ví dụ minh họa (Dữ liệu minh họa, giả sử ngày hiện tại là `21/10/2026`):**
    * `due_date`: Ngày cần hoàn thành | `completed_date`: Ngày thực tế hoàn thành.

| Công việc (Dữ liệu minh họa) | Trạng thái (`completed`) | Hạn (`due_date`) | Ngày xong (`completed_date`) | Kết quả phân loại |
| :--- | :--- | :--- | :--- | :--- |
| 1. Nộp báo cáo tuần | Chưa xong (`false`) | `18/10/2026` | `null` | **Quá hạn** (Chưa xong & đã qua hạn) |
| 2. Sửa lỗi giao diện | Đã xong (`true`) | `18/10/2026` | `20/10/2026` | **Hoàn thành trễ** (Xong sau ngày hạn) |
| 3. Viết tài liệu API | Đã xong (`true`) | `20/10/2026` | `19/10/2026` | **Đúng hạn / Không trễ** |
| 4. Đọc thêm Docker | Chưa xong (`false`) | `null` | `null` | **Không tính quá hạn** (Vì không đặt hạn) |

* **Hình / sơ đồ nên sử dụng:**
  * Bảng dữ liệu minh họa 4 dòng trực quan kèm màu sắc phân biệt trên slide.
* **Ghi chú lời nói của người thuyết trình (40 giây):**
  > "Slide này giải thích rõ cách ứng dụng tính trạng thái hạn hoàn thành. Trong database có hai cột ngày là `due_date` và `completed_date`. Em xin dùng bảng 4 công việc minh họa với giả sử hôm nay là ngày 21/10: việc số 1 chưa làm xong mà hạn là 18/10 nên bị tính là Quá hạn; việc số 2 đã làm xong vào ngày 20/10 nhưng hạn là 18/10 nên được nhận diện là Hoàn thành trễ; việc số 3 làm xong trước hạn nên không trễ; còn việc số 4 không đặt ngày hạn thì không bao giờ tính là quá hạn."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * Bảng dữ liệu minh họa đã hiển thị đầy đủ trên slide; có thể bổ sung thêm 1 ảnh chụp thẻ công việc có nhãn "Quá hạn" và "Hoàn thành trễ" trên UI.

---

## SLIDE 13 — Xóa công việc

* **Nội dung hiển thị:**
  * **Tiêu đề:** Xóa Công Việc
  * **Câu mô tả người dùng làm được gì:** Người dùng xóa bỏ công việc không còn cần thiết sau khi xác nhận, và được tự động chuyển về trang hợp lệ nếu trang cuối không còn mục nào.
  * **Ý chính:**
    * Hiển thị hộp thoại xác nhận trước khi thực hiện xóa để tránh thao tác nhầm.
    * Backend kiểm tra điều kiện `WHERE id = ? AND user_id = ?`, chỉ xóa công việc thuộc đúng tài khoản đó.
    * Sau khi xóa thành công (`204 No Content`), frontend làm mới lại danh sách và số thống kê.
    * Nếu xóa công việc cuối cùng của trang cuối (làm `page > totalPages` mới), ứng dụng tự động lùi URL về trang cuối còn tồn tại.
* **Hình / sơ đồ nên sử dụng:**
  * Sơ đồ luồng: `Người dùng bấm Xóa & xác nhận` ➔ `Giao diện gửi DELETE /api/todos/:id` ➔ `Hệ thống xóa bản ghi đúng user_id` ➔ `Kết quả làm mới danh sách & tự lùi trang nếu trang rỗng`.
* **Ghi chú lời nói của người thuyết trình (35 giây):**
  > "Khi người dùng muốn xóa một công việc, giao diện sẽ hỏi xác nhận trước để tránh bấm nhầm. Ở backend, câu lệnh DELETE luôn kiểm tra cả ID công việc lẫn `user_id` để đảm bảo chỉ xóa đúng việc của người đó. Một chi tiết xử lý ở frontend là: giả sử người dùng đang đứng ở trang 3 và xóa đúng công việc cuối cùng của trang này, khi dữ liệu tải lại chỉ còn 2 trang thì hook `useTodos` sẽ tự động chuyển URL lùi về trang 2 để người dùng không bị đứng ở một trang trống."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Thiếu ảnh giao diện:** Cần chụp ảnh hộp thoại xác nhận xóa trên giao diện.

---

## SLIDE 14 — Tìm kiếm công việc (SLIDE RIÊNG)

* **Nội dung hiển thị:**
  * **Tiêu đề:** Tìm Kiếm Công Việc
  * **Câu mô tả người dùng làm được gì:** Người dùng tìm kiếm các công việc theo tiêu đề trong toàn bộ danh sách công việc cá nhân của mình.
  * **Ý chính:**
    * Tìm kiếm theo tiêu đề công việc (`title LIKE %keyword%`).
    * Phân biệt rõ **nội dung đang nhập** (state cục bộ trong ô input của `TodoSearchBar`) và **từ khóa đã xác nhận** (`q` trên URL khi bấm nút Tìm/Enter).
    * Khi xác nhận tìm, từ khóa được gửi lên backend để tìm trong **toàn bộ công việc của user đó** chứ không chỉ tìm trên trang đang mở.
    * Nếu không có kết quả khớp, giao diện hiển thị thông báo không tìm thấy phù hợp.
    * **Hành vi theo đúng code thực tế:** Khi đang ở trang 1 và bấm tìm lại cùng một từ khóa đã xác nhận, giá trị `q` và `page=1` trên URL không đổi nên SWR key không đổi và **không gọi lại API**.
* **Hình / sơ đồ nên sử dụng:**
  * Sơ đồ luồng: `Người dùng gõ & bấm Tìm` ➔ `Giao diện cập nhật ?q=...&page=1 trên URL` ➔ `Hệ thống tìm theo title trong toàn bộ việc của user` ➔ `Kết quả hiển thị danh sách khớp hoặc báo trống`.
* **Ghi chú lời nói của người thuyết trình (40 giây):**
  > "Ở chức năng tìm kiếm, em tách riêng state đang gõ trong ô input với từ khóa đã xác nhận trên URL. Khi người dùng đang gõ chữ thì ứng dụng chưa gọi API, chỉ khi bấm Enter hoặc nút Tìm thì từ khóa mới được đưa lên URL và gửi về backend để tìm theo tiêu đề trong toàn bộ công việc của user đó. Theo đúng code hiện tại, nếu người dùng đang ở trang 1 mà bấm tìm lại cùng một từ khóa cũ, do tham số trên URL không thay đổi nên SWR key không đổi và trình duyệt sẽ không gọi lại API."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Thiếu ảnh giao diện:** Cần chụp ảnh thanh tìm kiếm khi có kết quả và khi không tìm thấy kết quả nào.

---

## SLIDE 15 — Lọc công việc (SLIDE RIÊNG)

* **Nội dung hiển thị:**
  * **Tiêu đề:** Lọc Công Việc Theo Tab
  * **Câu mô tả người dùng làm được gì:** Người dùng chuyển đổi giữa các tab lọc để xem riêng nhóm công việc chưa hoàn thành, đã hoàn thành hoặc quá hạn.
  * **Ý chính:**
    * Giao diện có 4 tab: **Tất cả (`all`)**, **Chưa hoàn thành (`pending`)**, **Đã hoàn thành (`completed`)**, **Quá hạn (`overdue`)**.
    * `filterTab` chỉ là tham số lọc gửi qua query string, **không phải một cột `status` trong database**.
    * Backend chuyển giá trị `filterTab` thành điều kiện SQL kết hợp trên 3 cột `completed`, `due_date` và `completed_date`.
    * Mỗi khi đổi tab lọc, ứng dụng luôn đưa số trang về `page = 1`.
    * Bộ đếm gắn trên từng tab phản ánh tổng số lượng của toàn bộ kết quả khớp từ khóa tìm kiếm, không chỉ đếm trong một trang.
* **Hình / sơ đồ nên sử dụng:**
  * Sơ đồ 4 tab lọc ánh xạ sang điều kiện SQL tương ứng ở backend.
* **Ghi chú lời nói của người thuyết trình (40 giây):**
  > "Tiếp theo là thao tác lọc công việc qua bốn tab: Tất cả, Chưa hoàn thành, Đã hoàn thành và Quá hạn. Điểm kỹ thuật chính ở đây là trong bảng `todos` không hề có cột `status`. Tham số `filterTab` gửi lên sẽ được backend chuyển thành câu điều kiện WHERE dựa trên cột `completed`, `due_date` và `completed_date`. Khi người dùng bấm đổi sang tab khác, giao diện luôn đưa về trang 1. Ngoài ra, con số đếm trên mỗi tab được tính trên toàn bộ kết quả tìm kiếm của user chứ không chỉ đếm 5 việc của trang hiện tại."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Thiếu ảnh giao diện:** Cần chụp ảnh 4 tab lọc kèm số đếm trên giao diện thực tế.

---

## SLIDE 16 — Phân trang (SLIDE RIÊNG)

* **Nội dung hiển thị:**
  * **Tiêu đề:** Phân Trang
  * **Câu mô tả người dùng làm được gì:** Người dùng xem danh sách công việc theo từng trang 5 mục và di chuyển giữa các trang mà không phải tải toàn bộ dữ liệu cùng lúc.
  * **Ý chính:**
    * Phân trang được thực hiện tại backend; frontend gửi `page` và `limit` (mặc định `limit = 5`).
    * Backend tính vị trí bắt đầu theo công thức: `offset = (page - 1) × limit`.
    * Câu lệnh SQL thực hiện lọc (theo user, từ khóa, tab) và sắp xếp (`created_at DESC, id DESC`) trước khi cắt lấy một trang.
    * Phản hồi trả về gồm mảng `data` của trang đó và đối tượng `pagination` (`page`, `limit`, `totalItems`, `totalPages`).
    * **Ví dụ minh họa 12 công việc, mỗi trang 5 mục:** Chia thành 3 trang — Trang 1 có 5 việc, Trang 2 có 5 việc, Trang 3 có 2 việc. Frontend chỉ giữ dữ liệu của trang hiện tại trong kết quả đang hiển thị.
* **Hình / sơ đồ nên sử dụng:**
  * Sơ đồ chia 12 công việc thành 3 khối trang (`Trang 1: 5 mục`, `Trang 2: 5 mục`, `Trang 3: 2 mục`) kèm công thức `offset`.
* **Ghi chú lời nói của người thuyết trình (40 giây):**
  > "Về phân trang, toàn bộ việc cắt trang được thực hiện ở MySQL phía backend. Frontend gửi số trang `page` và giới hạn `limit = 5`, backend tính `offset = (page - 1) × limit`. SQL sẽ lọc đúng điều kiện và sắp xếp theo thời gian tạo mới nhất trước, rồi mới lấy ra 5 bản ghi. Ví dụ user có 12 công việc thì sẽ chia làm 3 trang: trang 1 có 5 việc, trang 2 có 5 việc và trang 3 có 2 việc. Ở một thời điểm, kết quả đang hiển thị trên giao diện chỉ giữ các công việc của trang đang mở."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Thiếu ảnh giao diện:** Cần chụp thanh phân trang `TodoPagination` ở cuối danh sách khi có từ 2 trang trở lên.

---

## SLIDE 17 — Thống kê và tiến độ

* **Nội dung hiển thị:**
  * **Tiêu đề:** Thống Kê Và Tiến Độ Hoàn Thành
  * **Câu mô tả người dùng làm được gì:** Người dùng nắm bắt nhanh tổng số công việc, số lượng theo từng trạng thái và phần trăm tiến độ hoàn thành.
  * **Ý chính:**
    * Hiển thị 4 con số: Tổng công việc (`all`), Chưa hoàn thành (`pending`), Đã hoàn thành (`completed`), Quá hạn (`overdue`) và tỷ lệ `% hoàn thành`.
    * Các con số này được backend tính bằng các câu lệnh `COUNT` trên toàn bộ công việc phù hợp điều kiện tìm kiếm của user.
    * **Giải thích sự trùng lặp của nhóm Quá hạn:** Số lượng `overdue` không cộng dồn vào tổng `all` (vì `all = pending + completed`), mà `overdue` là nhóm giao nhau gồm những việc *đang chờ nhưng đã qua hạn* và những việc *đã xong nhưng hoàn thành trễ*.
* **Hình / sơ đồ nên sử dụng:**
  * Biểu đồ thanh tiến độ kèm sơ đồ tập hợp cho thấy `All = Pending + Completed`, còn `Overdue` lấy từ một phần của `Pending` (quá hạn) và một phần của `Completed` (hoàn thành trễ).
* **Ghi chú lời nói của người thuyết trình (35 giây):**
  > "Ở phần đầu trang công việc, người dùng sẽ thấy khu vực thống kê gồm tổng số công việc, số việc chưa xong, đã xong, quá hạn và tỷ lệ phần trăm hoàn thành. Các số này được tính trên toàn bộ công việc khớp từ khóa của user. Em xin giải thích thêm một điểm dễ gây thắc mắc là: tổng công việc bằng số chưa hoàn thành cộng với số đã hoàn thành; còn con số Quá hạn là tập hợp giao nhau, lấy từ những việc chưa xong đã trễ hạn cộng với những việc đã làm xong nhưng nộp trễ."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Thiếu ảnh giao diện:** Cần chụp khu vực `TodoHeader` hiển thị thanh phần trăm tiến độ và các con số thống kê.

---

## SLIDE 18 — Tổ chức frontend

* **Nội dung hiển thị:**
  * **Tiêu đề:** Tổ Chức Frontend
  * **Câu mô tả người dùng làm được gì:** Giúp mã nguồn giao diện rõ ràng, tách biệt phần hiển thị với phần quản lý URL, tải dữ liệu và gọi API.
  * **Ý chính:**
    * `TodoApp.jsx` đóng vai trò trang khung: ghép nối các phần và giữ state đóng/mở form tạo cùng ID công việc đang sửa.
    * Các component giao diện con: `TodoHeader`, `TodoSearchBar`, `TodoCreateForm`, `TodoFilterTabs`, `TodoList`, `TodoItem`, `TodoEditForm`, `TodoPagination`.
    * **State của form nằm ngay trong form:** Ô nhập của thanh tìm kiếm, form tạo và form sửa tự quản lý state riêng để khi gõ phím không làm render lại cả danh sách.
    * **3 Custom Hooks:** `useTodoQuery` (đọc/ghi URL), `useTodos` (tải danh sách bằng SWR), `useTodoMutations` (tạo/sửa/xóa); liên kết cha–con qua props và callback (`useCallback`, `React.memo`).
* **Hình / sơ đồ nên sử dụng:**
  * Cây component ngắn gọn từ `TodoApp` tỏa xuống 3 custom hooks và các component con (đã vẽ sẵn trên Slide 18).
* **Ghi chú lời nói của người thuyết trình (40 giây):**
  > "Về cách tổ chức code ở frontend, em tách trang `TodoApp` thành phần khung điều phối, kết hợp với ba custom hook: `useTodoQuery` quản lý tham số trên URL, `useTodos` tải dữ liệu bằng SWR, và `useTodoMutations` xử lý tạo, sửa, xóa. Đặc biệt, state nhập liệu của form tạo, form sửa và ô tìm kiếm đều được đặt nằm gọn bên trong chính component đó. Nhờ vậy khi người dùng gõ từng ký tự vào form, toàn bộ danh sách công việc bên dưới không bị render lại một cách không cần thiết."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * Sơ đồ cây component đã có trực tiếp trên slide.

---

## SLIDE 19 — SWR ở frontend (SLIDE RIÊNG)

* **Nội dung hiển thị:**
  * **Tiêu đề:** SWR Ở Frontend
  * **Câu mô tả người dùng làm được gì:** Quản lý dữ liệu công việc lấy từ API ở phía trình duyệt, tự động đồng bộ lại giao diện sau khi thêm, sửa hoặc xóa.
  * **Ý chính:**
    * Quản lý dữ liệu server ở phía frontend thông qua hook `useSWR`.
    * Lưu cache trong bộ nhớ trình duyệt theo key gồm: `['todos', { keyword, page, limit, filterTab }]`.
    * Cung cấp sẵn các trạng thái `data`, `error`, `isLoading` để giao diện hiển thị danh sách, thông báo lỗi hoặc skeleton.
    * Sau mỗi thao tác tạo, sửa, xóa thành công, gọi `mutate` để yêu cầu tải lại dữ liệu mới từ backend.
    * **Phân biệt rõ:** Component render lại chỉ là vẽ lại giao diện từ dữ liệu đang có, khác với việc gửi request gọi API; và SWR quản lý cache theo vòng đời key trên client chứ không đặt TTL đếm ngược từng giây giống Redis.
* **Hình / sơ đồ nên sử dụng:**
  * Sơ đồ vòng đời dữ liệu SWR trên trình duyệt: `Key [todos, query]` ➔ `Fetch API` ➔ `Trả data / isLoading / error cho UI` ➔ `Mutate làm mới sau khi Ghi`.
* **Ghi chú lời nói của người thuyết trình (40 giây):**
  > "Ở phía frontend, em sử dụng thư viện SWR để quản lý dữ liệu lấy từ API. SWR lưu cache dựa theo bộ key gồm trang hiện tại, từ khóa và tab lọc, đồng thời cung cấp sẵn biến theo dõi loading và lỗi. Sau khi người dùng tạo, sửa hoặc xóa công việc, em gọi hàm `mutate` để SWR tải lại dữ liệu mới nhất từ server. Em cũng phân biệt rõ việc React render lại giao diện với việc gọi API qua mạng, và SWR chỉ giữ dữ liệu trong bộ nhớ trình duyệt chứ không phải bộ nhớ đệm có TTL cố định như Redis."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * Không thiếu nội dung; khi thuyết trình có thể mở tab Network để minh họa lúc SWR revalidate.

---

## SLIDE 20 — Redis ở backend (SLIDE RIÊNG)

* **Nội dung hiển thị:**
  * **Tiêu đề:** Redis Ở Backend
  * **Câu mô tả người dùng làm được gì:** Lưu đệm kết quả đọc ở phía server để trả kết quả nhanh khi gặp truy vấn trùng lặp và vẫn hoạt động bình thường nếu Redis ngắt kết nối.
  * **Ý chính:**
    * Khi nhận request đọc, backend kiểm tra Redis trước qua hàm bọc `withCache`.
    * **Cache Hit:** Có sẵn dữ liệu trong Redis thì trả kết quả ngay, không cần truy vấn MySQL.
    * **Cache Miss:** Chưa có trong Redis thì đọc từ MySQL, lưu kết quả vào Redis với **TTL mặc định 60 giây** (`CACHE_TTL_SECONDS`) rồi trả về.
    * **Xử lý cache cũ sau khi tạo/sửa/xóa:** Backend xóa key chi tiết (`DEL`) và tăng số phiên bản danh sách của user (`INCR todos:ver:{userId}`), giúp các lần đọc tiếp theo chuyển sang dùng key của version mới.
    * **Cơ chế Fallback:** Nếu Redis chưa sẵn sàng (`!isReady`) hoặc gặp lỗi, backend tự động bỏ qua bước cache và đọc trực tiếp từ MySQL.
* **Hình / sơ đồ nên sử dụng:**
  * Sơ đồ luồng `Đọc Redis trước` ➔ `Hit (Trả ngay)` / `Miss (Đọc MySQL + Lưu TTL 60s)` và nhánh `Ghi DB xong ➔ Tăng version todos:ver:{userId}`.
* **Ghi chú lời nói của người thuyết trình (40 giây):**
  > "Ở phía backend, em dùng Redis theo mô hình đọc cache trước. Nếu tìm thấy dữ liệu trong Redis tức là cache hit thì trả về ngay; nếu cache miss thì mới truy vấn MySQL rồi lưu vào Redis với TTL mặc định 60 giây. Khi người dùng tạo, sửa hoặc xóa công việc, thay vì phải quét xóa từng trang đã cache, backend chỉ cần tăng số phiên bản `todos:ver:{userId}` lên 1 đơn vị để các request sau tự động đọc sang nhánh key mới. Trường hợp Redis bị ngắt kết nối, code đã có nhánh fallback đọc thẳng từ MySQL để không làm gián đoạn ứng dụng."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Thiếu bằng chứng log:** Cần chụp ảnh cửa sổ terminal log của backend khi chạy chế độ dev hiển thị các dòng `CACHE MISS`, `CACHE HIT` và `INCR`.

---

## SLIDE 21 — Thiết kế database và quyền sở hữu

* **Nội dung hiển thị:**
  * **Tiêu đề:** Thiết Kế Database Và Quyền Sở Hữu
  * **Câu mô tả người dùng làm được gì:** Đảm bảo dữ liệu công việc được lưu trữ có cấu trúc trong MySQL và mỗi người dùng chỉ có thể tác động lên công việc của chính mình.
  * **Ý chính:**
    * Hai bảng chính đang hoạt động là `users` và `todos`; một `user` sở hữu nhiều `todo` qua khóa ngoại `todos.user_id` (`ON DELETE CASCADE`).
    * Các cột quan trọng phục vụ nghiệp vụ: `completed` (boolean), `due_date` (ngày hạn), `completed_date` (ngày hoàn thành).
    * Mọi câu lệnh SQL xem chi tiết, sửa hoặc xóa đều bắt buộc kèm điều kiện `WHERE id = ? AND user_id = ?`.
    * Đánh index `idx_todos_user_created` trên `(user_id, created_at, id)` để phục vụ truy vấn lọc theo user và sắp xếp theo thời gian tạo.
    * Hai bảng `tags` và `todo_tags` trong file migration hiện là thiết kế mở rộng ở tầng SQL, chưa phải tính năng hoàn chỉnh.
* **Hình / sơ đồ nên sử dụng:**
  * Sơ đồ ERD giữa `users` và `todos` (nét liền) cùng khối `tags` / `todo_tags` (nét đứt ghi rõ "Thiết kế mở rộng").
* **Ghi chú lời nói của người thuyết trình (35 giây):**
  > "Về cơ sở dữ liệu MySQL, phần chính của ứng dụng nằm ở hai bảng `users` và `todos` nối với nhau qua khóa ngoại `user_id`. Trên bảng `todos`, ngoài tiêu đề và mô tả thì ba cột quan trọng nhất là `completed`, `due_date` và `completed_date`. Để bảo vệ quyền sở hữu dữ liệu, tất cả các câu lệnh SQL sửa hoặc xóa đều khóa theo cả `id` của công việc và `user_id` của người đang đăng nhập, đồng thời em có tạo index trên `(user_id, created_at, id)` để khớp với câu truy vấn danh sách. Còn hai bảng `tags` và `todo_tags` hiện mới là phần thiết kế mở rộng trong schema."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * Sơ đồ ERD đã được dựng trực tiếp trên Slide 21.

---

## SLIDE 22 — Chạy bản production trên Docker

* **Nội dung hiển thị:**
  * **Tiêu đề:** Chạy Bản Production Trên Docker
  * **Câu mô tả người dùng làm được gì:** Khởi chạy toàn bộ hệ thống gồm giao diện tĩnh, API backend, MySQL và Redis bằng một lệnh Docker Compose.
  * **Ý chính:**
    * **Frontend:** Được build bằng Vite thành bộ file tĩnh và phục vụ qua **Nginx** ở cổng `8080`, đồng thời Nginx proxy các request `/api` sang backend.
    * **Backend:** Chạy trực tiếp bằng lệnh `node src/server.js` (cài đặt gói bằng `npm ci --omit=dev`, không dùng `nodemon`).
    * **MySQL & Redis:** MySQL lưu dữ liệu bền vững qua volume `mysql_data`; Redis chạy nội bộ phục vụ cache.
    * **Phân biệt cấu hình:** File `docker-compose.yml` dùng cho cấu hình chạy kiểu production; còn `docker-compose.dev.yml` là file override dùng khi dev để mở cổng MySQL `3307` và xem log cache.
    * Lưu ý: Có Docker Compose giúp chuẩn hóa môi trường chạy thử, không đồng nghĩa hệ thống đã hoàn tất mọi tiêu chuẩn production thực tế.
* **Hình / sơ đồ nên sử dụng:**
  * Sơ đồ 4 container trong `docker-compose.yml` kèm dòng lệnh khởi chạy.
* **Ghi chú lời nói của người thuyết trình (40 giây):**
  > "Ở bước đóng gói, em cấu hình Docker Compose gồm bốn dịch vụ. Phía frontend dùng multi-stage build: build code React bằng Vite trước rồi đưa file tĩnh sang cho Nginx phục vụ ở cổng 8080 và proxy `/api` vào backend. Container backend cài các gói production và chạy bằng lệnh `node` chứ không dùng `nodemon`. Dữ liệu MySQL được giữ lại qua volume `mysql_data`. Em cũng tách riêng file `docker-compose.dev.yml` khi cần bật log dev. Tất nhiên, việc đóng gói Docker ở đây giúp chạy môi trường đồng nhất trên máy local chứ chưa phải đã đủ mọi yêu cầu vận hành thực tế như HTTPS hay giám sát."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Thiếu ảnh chụp:** Cần chụp kết quả lệnh `docker compose ps` khi cả 4 container đều ở trạng thái `Up / healthy`.

---

## SLIDE 23 — Kiểm thử và các trường hợp đã kiểm tra

* **Nội dung hiển thị:**
  * **Tiêu đề:** Kiểm Thử Và Các Trường Hợp Đã Kiểm Tra
  * **Câu mô tả người dùng làm được gì:** Đối chiếu trung thực các trường hợp kiểm thử từ đăng nhập, CRUD, phân quyền đến cache và Docker dựa trên bằng chứng thực tế.
  * **Bảng trạng thái kiểm tra (Không tự đánh dấu Pass khi chưa đính kèm bằng chứng):**
    1. **Đăng nhập, F5 (`/auth/me`) & Đăng xuất:** Đã có code — *Cần kiểm tra & bổ sung ảnh/log*.
    2. **Thao tác CRUD & Đánh dấu hoàn thành:** Đã có code — *Cần kiểm tra & bổ sung ảnh*.
    3. **Validation dữ liệu đầu vào (Frontend & Zod):** Đã có code — *Cần kiểm tra & bổ sung ảnh lỗi 400*.
    4. **Quyền truy cập giữa 2 tài khoản A và B:** Đã có code — *Cần kiểm tra & bổ sung bằng chứng trả về 404*.
    5. **Tìm kiếm, Lọc 4 tab & Phân trang:** Đã có code — *Cần kiểm tra & bổ sung ảnh*.
    6. **Redis Cache Hit/Miss & Cập nhật sau khi ghi:** Đã có code — *Cần kiểm tra & chụp log backend*.
    7. **Chạy Build/Lint & Docker Compose production:** *Cần kiểm tra & gắn kết quả terminal*.
* **Hình / sơ đồ nên sử dụng:**
  * Bảng checklist 7 hạng mục kiểm thử kèm cột trạng thái bằng chứng rõ ràng trên Slide 23.
* **Ghi chú lời nói của người thuyết trình (35 giây):**
  > "Tại slide này, em liệt kê các trường hợp kiểm thử quan trọng của dự án gồm: đăng nhập và nhấn F5, các thao tác CRUD, kiểm tra dữ liệu đầu vào, kiểm tra tài khoản B không được sửa xóa công việc của tài khoản A, tìm kiếm-lọc-phân trang, kiểm tra log Redis hit/miss và chạy thử bản Docker. Để đảm bảo tính trung thực của báo cáo, những mục em mới đối chiếu qua mã nguồn mà chưa đính kèm ảnh chụp hoặc log chạy thực tế vào slide thì em đều ghi rõ trạng thái là 'Đã có code — Cần kiểm tra' để bổ sung đầy đủ bằng chứng."
* **Phần cần bổ sung bằng chứng / ảnh:**
  * **Cần thực hiện:** Chạy thực tế từng mục trong bảng trên, chụp màn hình kết quả và cập nhật trạng thái tương ứng trước buổi báo cáo.

---

## SLIDE 24 — Việc còn lại và phản hồi cần từ mentor

* **Nội dung hiển thị:**
  * **Tiêu đề:** Việc Còn Lại Và Phản Hồi Cần Từ Mentor
  * **Câu mô tả người dùng làm được gì:** Tổng hợp những điểm còn hạn chế trong dự án, xác định thứ tự việc cần làm tiếp theo và xin ý kiến định hướng từ mentor.
  * **1. Các vấn đề còn tồn tại:**
    * Chưa có bộ test tự động (`npm test` ở backend mới là dòng lệnh giữ chỗ).
    * Trang `/todos` chưa có `ProtectedRoute` riêng; trang Login/Register chưa chuyển sang dùng chung `httpClient`.
    * SWR key chưa kèm `userId`; `TodoList` vẫn ưu tiên hiện skeleton khi `isLoading = true` lúc chuyển trang.
  * **2. Thứ tự ưu tiên tiếp theo:**
    * **(1)** Chạy kiểm thử toàn bộ danh mục ở Slide 23 và bổ sung ảnh chụp/log thực tế.
    * **(2)** Bổ sung `ProtectedRoute`, gắn `userId` vào SWR key và đồng bộ `httpClient` cho Auth.
    * **(3)** Viết test tự động cho các luồng chính và triển khai tiếp phần dự kiến (sắp xếp công việc, quản lý tags).
  * **3. Những quyết định muốn xin mentor góp ý:**
    * Cách tách 3 custom hooks (`useTodoQuery`, `useTodos`, `useTodoMutations`) ở frontend hiện tại đã hợp lý và dễ bảo trì chưa?
    * Cơ chế tăng version key `todos:ver:{userId}` trên Redis khi thêm/sửa/xóa có điểm nào cần điều chỉnh thêm không?
    * Khi bắt đầu viết test cho dự án này, em nên ưu tiên viết Integration Test gọi qua API trước hay Unit Test cho tầng Service trước?
* **Hình / sơ đồ nên sử dụng:**
  * Bố cục 3 cột tổng kết: `Vấn đề tồn tại` — `Thứ tự ưu tiên` — `Câu hỏi xin góp ý từ Mentor`.
* **Ghi chú lời nói của người thuyết trình (40 giây):**
  > "Cuối cùng, em xin tổng hợp lại những việc còn tồn tại và hướng hoàn thiện tiếp theo. Hiện dự án chưa có test tự động, phía frontend cần bổ sung thêm `ProtectedRoute`, đưa `userId` vào key của SWR và chỉnh lại điều kiện hiển thị skeleton khi chuyển trang. Thứ tự ưu tiên của em ngay sau buổi hôm nay là hoàn thành bộ bằng chứng kiểm thử, khắc phục các điểm nhỏ ở frontend rồi viết test tự động. Em rất mong nhận được góp ý của anh/chị `[Tên mentor]` về cách em tách hook ở frontend, cách làm mới cache bằng version ở Redis và hướng viết test phù hợp. Em cảm ơn anh/chị đã lắng nghe ạ!"
* **Phần cần bổ sung bằng chứng / ảnh:**
  * Ghi chú lại các góp ý của mentor trong buổi báo cáo để cập nhật vào kế hoạch hành động.