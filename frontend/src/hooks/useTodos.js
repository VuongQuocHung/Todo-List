import { useContext } from 'react';
import useSWR from 'swr';
import { getTodos } from '../api/todoApi';
import { AuthContext } from '../contexts/AuthContext';

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
  const { user, isAuthLoading } = useContext(AuthContext);
  const userId = user?.id;
  const { 
    data: cachedData,
    error, 
    isLoading, 
    mutate 
  } = useSWR(
    !isAuthLoading && userId != null ? [
      TODOS_KEY, userId, { // Cache riêng theo user, từ khóa, trang và tab
        keyword, 
        page, 
        limit: PAGE_SIZE, 
        filterTab 
      }
    ] : null,
    async ([, ownerId, params]) => ({ ...await getTodos(params), ownerId }),
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

  // keepPreviousData chỉ được giữ dữ liệu của cùng tài khoản.
  const data = !isAuthLoading && userId != null && cachedData?.ownerId === userId
    ? cachedData
    : undefined;

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
    isLoading: isAuthLoading || isLoading,
    error,
    reload: mutate, // gọi sau khi tạo/sửa/xóa để tải lại danh sách
  };
};
