# Kế hoạch tái cấu trúc `TodoApp.jsx`

Cập nhật: **20/10/2026**. Phạm vi: frontend, trang `/todos` (`frontend/src/pages/TodoApp.jsx`).

Tick `[x]` sau khi đã chạy thử và commit từng bước; chỉ đánh dấu xong khi đã kiểm tra trên app thật.

**Tiến độ:** xong giai đoạn A, B, C1 và F1. `TodoApp.jsx` hiện ~340 dòng (ban đầu ~400). Còn lại: C2–C3, SWR (D), `memo` (F2–F3), E.

## 0. Góp ý của mentor

| Góp ý                                                            | Ở đâu trong plan                                                         | Tình trạng                               |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------- |
| Dùng SWR                                                         | Giai đoạn D                                                              | Chưa làm                                 |
| Dùng AbortController                                             | B1 (timeout), B3 (hủy request cũ trong `useEffect`), E1 (`AuthProvider`) | Đã có timeout + hủy request cũ; còn E1   |
| Xử lý lỗi tập trung                                              | Giai đoạn C                                                              | Đã có `errorHandler`, chưa dùng (C2, C3) |
| Pure component cho `TodoItem`, `TodoItem` truyền quá nhiều props | Giai đoạn F                                                              | Đã giảm 17 → 8 props; còn `memo` (F2)    |

## 1. Vì sao phải tách

`TodoApp.jsx` ban đầu dài khoảng 400 dòng và làm 6 việc cùng lúc:

| #   | Việc đang làm               | Biểu hiện trong code                                                                                             |
| --- | --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | Gọi API                     | 4 chỗ `fetch`, lặp `credentials`, `headers`, `response.json().catch(...)`                                        |
| 2   | Quản lý dữ liệu server      | 6 state `todoList`, `stats`, `totalPages`, `isLoading`, `loadError`, `reloadKey` và một `useEffect` dài ~50 dòng |
| 3   | Xử lý lỗi                   | `try/catch` + `toast.error(error.message)` rải rác, mỗi chỗ một kiểu                                             |
| 4   | Lọc / tìm kiếm / phân trang | `keyword`, `searchKeyword`, `filterTab`, `currentPage`                                                           |
| 5   | Trạng thái giao diện        | form tạo, đang sửa, đang cập nhật, đang xóa                                                                      |
| 6   | Hiển thị                    | JSX dài, toán tử 3 ngôi lồng 3 tầng                                                                              |

Hệ quả:

- **Khó đọc**: muốn hiểu một chức năng phải đọc cả file.
- **Khó sửa**: backend đổi format lỗi thì phải sửa 4 chỗ.
- **Dễ sinh bug**: các state dính chùm với nhau, sửa chỗ này ảnh hưởng chỗ khác.
- **Không dùng lại được**: trang khác muốn gọi API todo phải chép lại code.
- **Render thừa**: state đặt ở `TodoApp` nên gõ một phím ở ô tìm kiếm hay form sửa cũng làm cả trang render lại.

**Nguyên tắc:**

- Mỗi file một trách nhiệm (Single Responsibility):
  - `components/` chỉ hiển thị.
  - `hooks/` quản lý dữ liệu và logic.
  - `api/` giao tiếp với server.
  - `lib/` chứa xử lý lỗi dùng chung.
- Thao tác ở đâu thì chỉ phần đó render lại:
  1. Ưu tiên **đặt state ở component thấp nhất cần dùng nó** (state colocation).
  2. State buộc phải để ở cha (nhiều component dùng chung) thì dùng `memo` + `useCallback`.

## 2. Cấu trúc sau khi tách

```text
frontend/src/
├── api/
│   ├── httpClient.js        ✅ bọc fetch: credentials, JSON, timeout, ném ApiError
│   └── todoApi.js           ✅ getTodos / createTodo / updateTodo / deleteTodo
├── lib/
│   └── errorHandler.js      ✅ xử lý lỗi tập trung: bỏ qua lỗi hủy, 401, toast
├── hooks/
│   ├── useTodos.js          ⏳ useSWR: tải danh sách + cache
│   └── useTodoMutations.js  ⏳ tạo/sửa/xóa + làm mới cache SWR
├── components/todo/
│   ├── TodoHeader.jsx
│   ├── TodoCreateForm.jsx
│   ├── TodoSearchBar.jsx    ✅ tự giữ chữ đang gõ
│   ├── TodoFilterTabs.jsx   ✅ thay TodoToolbar.jsx
│   ├── TodoErrorBanner.jsx  ✅
│   ├── TodoSkeletonList.jsx ✅
│   ├── TodoEmptyState.jsx   ✅
│   ├── TodoList.jsx         ⏳
│   ├── TodoItem.jsx         ✅ 8 props; ⏳ memo
│   ├── TodoEditForm.jsx     ✅ tự giữ state + validate
│   └── TodoPagination.jsx
└── pages/TodoApp.jsx        ← chỉ còn state giao diện + ghép component
```

### Lớp API và lỗi

| File                  | Trách nhiệm                                             | Lý do tách                                            |
| --------------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| `api/httpClient.js`   | Bọc `fetch`: credentials, JSON, timeout, ném `ApiError` | Bỏ 4 đoạn code lặp; đổi cách gọi mạng chỉ sửa một chỗ |
| `api/todoApi.js`      | `getTodos`, `createTodo`, `updateTodo`, `deleteTodo`    | Component không cần biết URL hay HTTP method          |
| `lib/errorHandler.js` | `handleError`, `getErrorMessage`, `isAbortError`        | Mọi lỗi xử lý cùng một kiểu; 401 xử lý ở một nơi      |

### Lớp hook

| File                        | Trách nhiệm                                | Lý do tách                                               |
| --------------------------- | ------------------------------------------ | -------------------------------------------------------- |
| `hooks/useTodos.js`         | Tải danh sách bằng SWR                     | Thay `useEffect` và 6 state                              |
| `hooks/useTodoMutations.js` | Tạo/sửa/xóa, chặn bấm trùng, làm mới cache | Chuyển state `pending` và phần gọi API ra khỏi `TodoApp` |

### Lớp component

| Component          | Hiển thị                                  | Lý do tách                                                                                                       |
| ------------------ | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `TodoErrorBanner`  | Thông báo lỗi tải danh sách               | Nhỏ, độc lập                                                                                                     |
| `TodoSkeletonList` | Khung xương khi đang tải                  | Nhỏ, độc lập                                                                                                     |
| `TodoEmptyState`   | Màn hình danh sách rỗng                   | Bỏ toán tử 3 ngôi lồng 3 tầng, dùng bảng tra `EMPTY_TITLES`                                                      |
| `TodoSearchBar`    | Ô tìm kiếm                                | `TodoToolbar` đang làm 2 việc; tự giữ chữ đang gõ để gõ phím không làm cả trang render lại                       |
| `TodoFilterTabs`   | Các tab lọc                               | 4 nút lặp → mảng `FILTER_TABS` + `.map()`                                                                        |
| `TodoList`         | Chọn hiển thị skeleton / rỗng / danh sách | Gom phần JSX phức tạp nhất ra khỏi `TodoApp`                                                                     |
| `TodoItem`         | Một công việc                             | 8 props: `item`, `isEditing`, `pendingAction`, `isLocked`, `onStartEdit`, `onCancelEdit`, `onUpdate`, `onDelete` |
| `TodoEditForm`     | Form sửa trong card                       | Tự giữ state và validate, chỉ gửi dữ liệu đã chuẩn hóa lên qua `onSave(data)`                                    |

## 3. Kỹ thuật áp dụng

### SWR — quản lý dữ liệu server

- **Thay thế:** `useEffect` tải dữ liệu, `reloadKey`, các state `isLoading` / `loadError` / `todoList` / `stats` / `totalPages`.
- **Có thêm:**
  - cache theo từng tổ hợp trang + tab + từ khóa, quay lại trang cũ hiện ngay;
  - tự gộp request trùng (dedupe);
  - tự tải lại khi quay lại tab trình duyệt;
  - `keepPreviousData` để chuyển trang không nháy skeleton;
  - tự thử lại khi lỗi mạng.
- Trang, tab, từ khóa đã nằm trên URL (`useSearchParams`), `useTodos` chỉ cần nhận các giá trị đọc từ URL.

### AbortController — hủy request

- **Timeout cho mọi request** trong `httpClient` (`AbortSignal.timeout`): server treo quá 10 giây thì tự hủy và báo lỗi. ✅
- **Hủy request cũ trong `useEffect`** tải danh sách: đổi trang/tab nhanh → request cũ hiện `(canceled)` trong tab Network. ✅ (sẽ được SWR thay thế ở D2)
- **`AuthProvider`**: thay cờ `ignore` bằng `controller.abort()` trong cleanup. ⏳ E1
- **Không** dùng để hủy request của SWR: SWR 2.x không truyền `signal` cho fetcher và đã tự bỏ qua kết quả cũ khi key đổi; tự `abort` dễ làm danh sách kẹt ở lỗi `AbortError` (do dedupe và StrictMode).

### Xử lý lỗi tập trung

- `ApiError` (`status`, `code`, `message`): chuẩn hóa mọi lỗi về một dạng, kể cả lỗi mạng (`NETWORK_ERROR`) và timeout (`TIMEOUT`). Khớp format `{ error: { code, message } }` của `backend/src/middlewares/error.middleware.js`. Lỗi do code sai (không phải `TypeError` của fetch) được ném nguyên để dễ debug.
- `handleError()`: một hàm duy nhất quyết định bỏ qua, toast hay đăng xuất.
- `SWRConfig.onError` / `onErrorRetry`: lỗi tải dữ liệu đi qua một chỗ; lỗi 4xx không thử lại.
- 401 → phát sự kiện `auth:unauthorized` → `AuthProvider` đăng xuất phía client.

### Giảm render thừa

- **State colocation:** state form sửa nằm trong `TodoEditForm`, chữ đang gõ nằm trong `TodoSearchBar`, state form tạo nằm trong `TodoCreateForm` → gõ phím chỉ component đó render lại.
- **`memo` + `useCallback` cho `TodoItem`:** dành cho state buộc ở `TodoApp` (`editingId`, `isCreateOpen`). Callback truyền thẳng (TodoItem tự truyền `item.id`), `pendingAction` là chuỗi nên `memo` so sánh được bằng `===`.
- Kiểm chứng bằng React DevTools → ⚙️ → "Highlight updates when components render".

### Kỹ thuật React khác

- **Custom hook**: tách logic khỏi giao diện.
- **Bảng cấu hình** (`FILTER_TABS`, `EMPTY_TITLES`) thay cho if/else và toán tử 3 ngôi.
- **Truyền JSX qua prop** (`emptyState`): `TodoList` không cần biết về tìm kiếm hay form tạo mới.
- **State trên URL** (`useSearchParams`): F5 không mất trang/tab/từ khóa, dùng được nút Back/Forward.

## 4. Lộ trình

Mỗi bước giữ app chạy được và commit riêng.

### Giai đoạn A — Tách component giao diện (không đổi hành vi)

- [x] A1. `TodoErrorBanner`
- [x] A2. `TodoSkeletonList`
- [x] A3. `TodoEmptyState`
- [x] A4. `TodoSearchBar` + `TodoFilterTabs`, bỏ `TodoToolbar`

### Giai đoạn B — Lớp API

- [x] B1. `api/httpClient.js` (`ApiError` + timeout)
- [x] B2. `api/todoApi.js`
- [x] B3. Thay 4 chỗ `fetch` trong `TodoApp` bằng `todoApi`; hủy request cũ bằng `AbortController`

### Giai đoạn C — Xử lý lỗi tập trung

- [x] C1. `lib/errorHandler.js`
- [x] C2. Thay `toast.error(error.message)` bằng `handleError(error)` trong `TodoApp` (cập nhật, xóa), `TodoCreateForm`, `Header` (đăng xuất); banner lỗi dùng `getErrorMessage`
- [x] C3. `AuthProvider` nghe sự kiện `auth:unauthorized`

### Giai đoạn D — SWR

- [ ] D1. `npm install swr` + `SWRConfig` trong `main.jsx`
- [ ] D2. `hooks/useTodos.js`, xóa `useEffect` và 6 state; tự lùi trang bằng `onSuccess`
- [ ] D3. `hooks/useTodoMutations.js` trả về `pending`, `createTodo`, `updateTodo`, `deleteTodo`; xóa `handleUpdateTodo` và phần gọi API trong `handleDelete`
- [ ] D4. `TodoList` (skeleton / rỗng / danh sách `TodoItem`)
- [ ] D5. Dọn `TodoApp`: xóa import thừa, chạy `npm run lint`

### Giai đoạn F — Giảm props và render thừa (góp ý của mentor)

- [x] F1.1. Tách `TodoEditForm` tự giữ state + validate (bỏ 7 props)
- [x] F1.2. Gộp `onSaveEdit` + `onToggleStatus` → `onUpdate(id, data)`; TodoItem tự truyền `item.id`
- [x] F1.3. Gộp `updatingId` + `deletingId` → `pending`; TodoItem nhận `pendingAction` + `isLocked` (còn 8 props)
- [x] F1.4. Chuyển chữ đang gõ vào `TodoSearchBar` (gõ phím không render lại `TodoApp`)
- [ ] F2. Bọc `TodoItem` bằng `memo`; `useCallback` cho callback, cờ chặn bấm trùng dùng `useRef`, `setEditingId(prev => ...)` (làm sau D3)
- [ ] F3. Kiểm chứng bằng "Highlight updates": bấm Sửa / mở form thêm mới → các TodoItem không liên quan không render lại; chụp ảnh trước/sau

### Giai đoạn E — Hoàn thiện

- [ ] E1. `AuthProvider` dùng `AbortController` thay cờ `ignore`
- [ ] E2. Xóa cache SWR khi đăng xuất (`mutate(() => true, undefined, { revalidate: false })`)

### Ngoài kế hoạch ban đầu (đã làm)

- [x] Sửa thanh phân trang bị ẩn/hiện lại mỗi lần chuyển trang (đưa ra ngoài điều kiện `isLoading`)
- [x] Lưu trang, tab, từ khóa lên URL bằng `useSearchParams`
- [x] Sửa lỗi `result is not defined` khi xóa (`todoApi.deleteTodo`) — đã sửa, chưa commit

**Thứ tự còn lại:** C2 → C3 → D1 → D5 → F2 → F3 → E1 → E2.

- C trước D vì `SWRConfig` gọi `handleError`.
- `TodoList` để đến D4 vì cần `pending` từ `useTodoMutations`.
- F2 sau D3 vì các callback chuyển vào `useTodoMutations`; bọc `useCallback` sớm sẽ phải viết lại.

## 5. Tiêu chí hoàn thành

- [ ] `TodoApp.jsx` còn ~150 dòng, không còn `fetch`, `useEffect`, `try/catch`.
- [ ] Không file nào dài quá ~150 dòng.
- [ ] `npm run lint` không báo lỗi.
- [ ] Kiểm tra thủ công, hành vi giữ như trước:
  - [ ] Tạo, sửa, xóa, tick hoàn thành
  - [ ] Tìm kiếm, xóa tìm kiếm, lọc theo tab, phân trang
  - [ ] F5 giữ nguyên trang/tab/từ khóa; Back/Forward chuyển đúng
  - [ ] Xóa phần tử cuối của trang cuối → tự lùi về trang trước
  - [ ] Tắt backend → hiện banner lỗi; bật lại → tải lại được
  - [ ] Hết phiên đăng nhập (401) → bị đăng xuất, chỉ hiện một toast
- [ ] "Highlight updates": gõ ô tìm kiếm / form tạo / form sửa chỉ component đó render lại
