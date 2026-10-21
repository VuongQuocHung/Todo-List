# Refactor frontend — Hiện trạng và việc còn lại

Cập nhật **21/10/2026** theo source. Phạm vi chính: trang /todos và phần auth dùng chung. “Có code” không thay thế kiểm thử UI hoặc đo profiler.

## 1. Góp ý mentor và thay đổi

| Góp ý | Source hiện tại | Trạng thái |
| --- | --- | --- |
| Dùng SWR | main.jsx cấu hình SWRConfig, useTodos đọc danh sách, useTodoMutations revalidate | Có code, cần nghiệm thu |
| AbortController | AuthProvider hủy /me khi cleanup; client dùng AbortSignal.timeout/any | Có code, cần test abort/timeout |
| Lỗi tập trung | ApiError, errorHandler, banner; 401 phát sự kiện cho AuthProvider | Có trong luồng Todo, /me, logout; Login/Register chưa dùng chung |
| TodoItem nhiều props | 8 props, form sửa tự giữ state | Có code |
| Giảm render | memo TodoItem, useCallback, state nhập liệu tại component | Có code, chưa có số đo profiler |
| Cache khi đổi tài khoản | AuthProvider xóa SWR cache khi logout/401 | Có code, cần test; key chưa có userId |

Bản kế hoạch ngày 20/10 từng ghi SWR/memo/AbortController chưa làm; bảng này thay thế trạng thái cũ. Không sử dụng mục tiêu số dòng cũ như kết quả đã đạt.

## 2. Phân chia trách nhiệm

| File/nhóm | Trách nhiệm |
| --- | --- |
| pages/TodoApp.jsx | Ghép UI, state mở form/đang sửa, điều phối thao tác |
| hooks/useTodoQuery.js | q/tab/page trên URL; lược giá trị mặc định |
| hooks/useTodos.js | SWR list, pagination/stats/error/loading, xử lý page overflow |
| hooks/useTodoMutations.js | Tạo/sửa/xóa, pending, useRef chặn update/delete trùng, revalidation |
| api/httpClient.js | fetch, credentials, JSON, 204, timeout, signal, ApiError |
| api/todoApi.js | getTodos/createTodo/updateTodo/deleteTodo |
| lib/errorHandler.js | Abort, message, toast, sự kiện auth:unauthorized |
| TodoCreateForm/TodoEditForm | State nhập liệu, validation và submit |
| TodoSearchBar | Từ khóa đang nhập, submit tìm kiếm; không debounce |
| TodoList/TodoItem | Skeleton/rỗng/danh sách; card và thao tác từng item |
| TodoFilterTabs/TodoPagination | Bộ lọc/số đếm và phân trang |
| TodoHeader/EmptyState/ErrorBanner/SkeletonList | Các phần hiển thị độc lập |
| AuthProvider | /me, Context user, logout, nghe 401, xóa cache |

## 3. Những cơ chế đã có

- SWR key chứa keyword/page/limit/filterTab, limit=5.
- keepPreviousData được bật.
- Sau mutation, mutate lọc các key thuộc Todo để yêu cầu revalidation; không có optimistic update.
- Update/delete giữ pending tới khi lời gọi revalidation kết thúc; create gọi revalidation nhưng không await nó trong hook.
- Sau create, TodoApp về page=1 nhưng giữ keyword/tab. Sau delete/update có page overflow thì chỉnh URL về trang cuối.
- State nhập liệu nằm trong form/search; memo và callback ổn định giúp hạn chế render không cần thiết, chưa có benchmark.
- httpClient timeout mặc định 10 giây; abort chủ động được bỏ qua trong errorHandler.
- AuthProvider có AbortController riêng cho /me, không phải SWR tự abort mọi request cũ.
- 401 có toast ID để gộp thông báo; lỗi tải danh sách dùng banner qua handleError silent.
- AuthProvider gọi mutate để xóa cache khi logout hoặc nhận sự kiện 401.

## 4. Cần hoàn thiện

| Việc | Lý do/tiêu chí |
| --- | --- |
| Kiểm tra keepPreviousData và isLoading | TodoList đang ưu tiên skeleton nếu isLoading, chưa chắc giữ được danh sách cũ trên màn hình |
| ProtectedRoute và chờ auth | /todos hiện render trực tiếp và gọi useTodos chưa được gate theo user |
| Phân vùng SWR cache theo user | Key hiện chưa có userId; cần test logout/login và request đang chạy |
| Chuyển Login/Register sang client chung | Hiện fetch trực tiếp, chưa có cùng timeout/lỗi chuẩn hóa |
| Phân biệt lỗi /me | Catch hiện đặt user=null cả khi mạng/server lỗi |
| Dọn debug log | useTodos/TodoApp còn console.log |
| Kiểm tra dependencies effect | AuthProvider effect nghe 401 gọi clearCache; chạy lint và xử lý kết quả thật |
| Kiểm chứng pending/form | Submit nhanh, sửa/xóa khi đang chờ, giữ dữ liệu nhập khi lỗi |

## 5. Checklist nghiệm thu

Tất cả mục dưới đây chưa được xác nhận chạy trong lần cập nhật tài liệu này.

- [ ] CRUD và tick hoàn thành giữ đúng dữ liệu DB/UI.
- [ ] Tìm kiếm chỉ gửi khi submit; xóa keyword, đổi tab và phân trang đúng.
- [ ] F5/Back/Forward giữ q/tab/page.
- [ ] Xóa/sửa item cuối trang làm URL chuyển về trang hợp lệ.
- [ ] Đổi query nhanh không hiển thị sai dữ liệu; kiểm tra skeleton/previous data.
- [ ] Mất mạng/timeout/backend lỗi có thông báo và phục hồi được.
- [ ] 401 xử lý phiên và không lặp toast.
- [ ] Logout A/login B không hiển thị cache A, cả khi request còn đang chạy.
- [ ] Abort /me khi cleanup không cập nhật state từ request đã hủy.
- [ ] DevTools/Profiler kiểm tra render khi gõ form, mở form và sửa item.
- [ ] Chạy npm run lint và npm run build; ghi kết quả, không mặc định pass.

Không dùng số dòng hoặc số props làm tiêu chí duy nhất. Hành vi đúng, trách nhiệm rõ và bằng chứng kiểm chứng là tiêu chí chính.

[Báo cáo](TodoApp.md) · [Kiến trúc](architecture.md) · [Tiến độ](timeline.md)
