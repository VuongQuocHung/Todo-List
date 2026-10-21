import useSWR from 'swr';
import { getTodos } from '../api/todoApi';

export const TODOS_KEY = 'todos';
const PAGE_SIZE = 5;

// Giá trị mặc định đặt ngoài hook, giữ nguyên tham chiếu giữa các lần render
const EMPTY_LIST = [];
const EMPTY_STATS = { all: 0, pending: 0, completed: 0, overdue: 0 };

export const useTodos = ({ 
  keyword, 
  page, 
  filterTab, 
  onPageOverflow 
}) => {
  const { 
    data, 
    error, 
    isLoading, 
    mutate 
  } = useSWR(
    [
      TODOS_KEY, { // Key: từ khóa / trang / tab đổi thì SWR tự tải lại; mỗi tổ hợp có cache riêng
        keyword, 
        page, 
        limit: PAGE_SIZE, 
        filterTab 
      }
    ],
    ([, params]) => getTodos(params),
    {
      // Đang tải trang mới vẫn giữ danh sách cũ trên màn hình, không nháy skeleton
      keepPreviousData: true,

      onSuccess: (result) => {
        // Xóa/sửa phần tử cuối của trang có thể làm giảm tổng số trang
        const lastPage = Math.max(1, result.pagination.totalPages);
        if (result.pagination.page > lastPage) {
          onPageOverflow(lastPage);
        }
      },
    },
  );

  console.log('[SWR] Dữ liệu đang dùng:', {
    keyword,
    page,
    filterTab,
    data,
  });

  return {
    todoList: data?.data ?? EMPTY_LIST,
    totalPages: data?.pagination.totalPages ?? 0,
    stats: data?.stats ?? EMPTY_STATS,
    isLoading, // chỉ true khi CHƯA có dữ liệu nào để hiện (lần tải đầu)
    error,
    reload: mutate, // gọi sau khi tạo/sửa/xóa để tải lại danh sách
  };
};
