# Kế hoạch tái cấu trúc `TodoApp.jsx`

Cập nhật: **20/10/2026**. Phạm vi: frontend, trang `/todos` (`frontend/src/pages/TodoApp.jsx`).

Tick `[x]` sau khi đã chạy thử và commit từng bước; chỉ đánh dấu xong khi đã kiểm tra trên app thật.

## 1. Vì sao phải tách

`TodoApp.jsx` dài khoảng 400 dòng và đang làm 6 việc cùng lúc:

| # | Việc đang làm | Biểu hiện trong code |
|---|---|---|
| 1 | Gọi API | 4 chỗ `fetch`, lặp `credentials`, `headers`, `response.json().catch(...)` |
| 2 | Quản lý dữ liệu server | 6 state `todoList`, `stats`, `totalPages`, `isLoading`, `loadError`, `reloadKey` và một `useEffect` dài ~50 dòng |
| 3 | Xử lý lỗi | `try/catch` + `toast.error(error.message)` rải rác, mỗi chỗ một kiểu |
| 4 | Lọc / tìm kiếm / phân trang | `keyword`, `searchKeyword`, `filterTab`, `currentPage` |
| 5 | Trạng thái giao diện | form tạo, đang sửa, đang cập nhật, đang xóa |
| 6 | Hiển thị | JSX dài, toán tử 3 ngôi lồng 3 tầng |

Hệ quả:

- **Khó đọc**: muốn hiểu một chức năng phải đọc cả file.
- **Khó sửa**: backend đổi format lỗi thì phải sửa 4 chỗ.
- **Dễ sinh bug**: các state dính chùm với nhau, sửa chỗ này ảnh hưởng chỗ khác.
- **Không dùng lại được**: trang khác muốn gọi API todo phải chép lại code.

**Nguyên tắc:** mỗi file một trách nhiệm (Single Responsibility).

- `components/` chỉ hiển thị.
- `hooks/` quản lý dữ liệu và logic.
- `api/` giao tiếp với server.
- `lib/` chứa xử lý lỗi dùng chung.

## 2. Cấu trúc sau khi tách

```text
frontend/src/
├── api/
│   ├── httpClient.js        ← bọc fetch: credentials, JSON, timeout, ném ApiError
│   └── todoApi.js           ← getTodos / createTodo / updateTodo / deleteTodo
├── lib/
│   └── errorHandler.js      ← xử lý lỗi tập trung: bỏ qua lỗi hủy, 401, toast
├── hooks/
│   ├── useTodos.js          ← useSWR: tải danh sách + cache
│   └── useTodoMutations.js  ← tạo/sửa/xóa + làm mới cache SWR
├── components/todo/
│   ├── TodoHeader.jsx
│   ├── TodoCreateForm.jsx
│   ├── TodoSearchBar.jsx
│   ├── TodoFilterTabs.jsx   ← thay TodoToolbar.jsx
│   ├── TodoErrorBanner.jsx
│   ├── TodoSkeletonList.jsx
│   ├── TodoEmptyState.jsx
│   ├── TodoList.jsx
│   ├── TodoItem.jsx
│   ├── TodoEditForm.jsx
│   └── TodoPagination.jsx
└── pages/TodoApp.jsx        ← chỉ còn state giao diện + ghép component
```

### Lớp API và lỗi

| File | Trách nhiệm | Lý do tách |
|---|---|---|
| `api/httpClient.js` | Bọc `fetch`: credentials, JSON, timeout, ném `ApiError` | Bỏ 4 đoạn code lặp; đổi cách gọi mạng chỉ sửa một chỗ |
| `api/todoApi.js` | `getTodos`, `createTodo`, `updateTodo`, `deleteTodo` | Component không cần biết URL hay HTTP method |
| `lib/errorHandler.js` | `handleError`, `getErrorMessage`, `isAbortError` | Mọi lỗi xử lý cùng một kiểu; 401 xử lý ở một nơi |

### Lớp hook

| File | Trách nhiệm | Lý do tách |
|---|---|---|
| `hooks/useTodos.js` | Tải danh sách bằng SWR | Thay `useEffect` và 6 state |
| `hooks/useTodoMutations.js` | Tạo/sửa/xóa, chặn bấm trùng, làm mới cache | Gộp `updatingId` + `deletingId` thành một state `pending` |

### Lớp component

| Component | Hiển thị | Lý do tách |
|---|---|---|
| `TodoErrorBanner` | Thông báo lỗi tải danh sách | Nhỏ, độc lập |
| `TodoSkeletonList` | Khung xương khi đang tải | Nhỏ, độc lập |
| `TodoEmptyState` | Màn hình danh sách rỗng | Bỏ toán tử 3 ngôi lồng 3 tầng, dùng bảng tra `EMPTY_TITLES` |
| `TodoSearchBar` | Ô tìm kiếm | `TodoToolbar` đang làm 2 việc |
| `TodoFilterTabs` | Các tab lọc | 4 nút lặp → mảng `FILTER_TABS` + `.map()` |
| `TodoList` | Chọn hiển thị skeleton / rỗng / danh sách | Gom phần JSX phức tạp nhất ra khỏi `TodoApp` |
| `TodoItem` + `TodoEditForm` | Một công việc / form sửa | Đã tách; form sửa tự giữ state và validate |

## 3. Kỹ thuật áp dụng

### SWR — quản lý dữ liệu server

- **Thay thế:** `useEffect` tải dữ liệu, cờ `ignore`, `reloadKey`, các state `isLoading` / `loadError` / `todoList`.
- **Có thêm:**
  - cache theo từng tổ hợp trang + tab + từ khóa, quay lại trang cũ hiện ngay;
  - tự gộp request trùng (dedupe);
  - tự tải lại khi quay lại tab trình duyệt;
  - `keepPreviousData` để chuyển trang không nháy skeleton;
  - tự thử lại khi lỗi mạng.

### AbortController — hủy request

- **Timeout cho mọi request** trong `httpClient` (`AbortSignal.timeout`): server treo quá 10 giây thì tự hủy và báo lỗi.
- **Hủy fetch trong `useEffect`** ở `AuthProvider`: thay cờ `ignore` bằng `controller.abort()` trong cleanup, hủy hẳn request thay vì chỉ bỏ qua kết quả.
- **Không** dùng để hủy request của SWR: SWR 2.x không truyền `signal` cho fetcher và đã tự bỏ qua kết quả cũ khi key đổi; tự `abort` dễ làm danh sách kẹt ở lỗi `AbortError` (do dedupe và StrictMode).

### Xử lý lỗi tập trung

- `ApiError` (`status`, `code`, `message`): chuẩn hóa mọi lỗi về một dạng, kể cả lỗi mạng và timeout. Khớp format `{ error: { code, message } }` của `backend/src/middlewares/error.middleware.js`.
- `handleError()`: một hàm duy nhất quyết định bỏ qua, toast hay đăng xuất.
- `SWRConfig.onError` / `onErrorRetry`: lỗi tải dữ liệu đi qua một chỗ; lỗi 4xx không thử lại.
- 401 → phát sự kiện `auth:unauthorized` → `AuthProvider` đăng xuất phía client.

### Kỹ thuật React khác

- **Custom hook**: tách logic khỏi giao diện.
- **Bảng cấu hình** (`FILTER_TABS`, `EMPTY_TITLES`) thay cho if/else và toán tử 3 ngôi.
- **Truyền JSX qua prop** (`emptyState`): `TodoList` không cần biết về tìm kiếm hay form tạo mới.
- *(Để sau)* `memo` + `useCallback` cho `TodoItem`.

## 4. Lộ trình

Mỗi bước giữ app chạy được và commit riêng.

### Giai đoạn A — Tách component giao diện (không đổi hành vi)

- [x] A1. `TodoErrorBanner`
- [ ] A2. `TodoSkeletonList`
- [ ] A3. `TodoEmptyState`
- [ ] A4. `TodoSearchBar` + `TodoFilterTabs`, bỏ `TodoToolbar` (sửa `handleSearch` bỏ tham số `event`)

### Giai đoạn B — Lớp API

- [ ] B1. `api/httpClient.js` (`ApiError` + timeout)
- [ ] B2. `api/todoApi.js`
- [ ] B3. Thay 4 chỗ `fetch` trong `TodoApp` bằng `todoApi`

### Giai đoạn C — Xử lý lỗi tập trung

- [ ] C1. `lib/errorHandler.js`
- [ ] C2. Thay `toast.error(error.message)` bằng `handleError(error)` trong `TodoApp` và `TodoCreateForm`
- [ ] C3. `AuthProvider` nghe sự kiện `auth:unauthorized`

### Giai đoạn D — SWR

- [ ] D1. `npm install swr` + `SWRConfig` trong `main.jsx`
- [ ] D2. `hooks/useTodos.js`, xóa `useEffect` và 6 state
- [ ] D3. `hooks/useTodoMutations.js`, xóa `handleUpdateTodo` và phần gọi API trong `handleDelete`
- [ ] D4. `TodoList` + cập nhật `TodoItem` dùng `pending` (`isUpdating`, `isDeleting`, `isLocked`)
- [ ] D5. Dọn `TodoApp`: xóa import thừa, chạy `npm run lint`

### Giai đoạn E — Hoàn thiện

- [ ] E1. `AuthProvider` dùng `AbortController` thay cờ `ignore`
- [ ] E2. Xóa cache SWR khi đăng xuất (`mutate(() => true, undefined, { revalidate: false })`)

**Vì sao theo thứ tự này:**

- A dễ nhất, không phụ thuộc phần nào.
- B trước C vì `errorHandler` cần `ApiError`.
- C trước D vì `SWRConfig` gọi `handleError`.
- `TodoList` để đến D4 vì cần `pending` từ `useTodoMutations`.

## 5. Tiêu chí hoàn thành

- [ ] `TodoApp.jsx` còn ~150 dòng, không còn `fetch`, `useEffect`, `try/catch`.
- [ ] Không file nào dài quá ~150 dòng.
- [ ] `npm run lint` không báo lỗi.
- [ ] Kiểm tra thủ công, hành vi giữ như trước:
  - [ ] Tạo, sửa, xóa, tick hoàn thành
  - [ ] Tìm kiếm, xóa tìm kiếm, lọc theo tab, phân trang
  - [ ] Xóa phần tử cuối của trang cuối → tự lùi về trang trước
  - [ ] Tắt backend → hiện banner lỗi; bật lại → tải lại được
  - [ ] Hết phiên đăng nhập (401) → bị đăng xuất, chỉ hiện một toast
