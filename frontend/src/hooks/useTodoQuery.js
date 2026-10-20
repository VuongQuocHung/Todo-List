import { useSearchParams } from 'react-router-dom';

const FILTER_TABS = ['all', 'pending', 'completed', 'overdue'];

// Tạo query mới từ query cũ + các thay đổi.
// Giá trị mặc định (trang 1, tab all, từ khóa rỗng) thì xóa khỏi URL cho gọn.
const applyQueryChanges = (prev, changes) => {
  const next = new URLSearchParams(prev);

  Object.entries(changes).forEach(([key, value]) => {
    const isDefault =
      value === '' ||
      (key === 'page' && value === 1) ||
      (key === 'tab' && value === 'all');

    if (isDefault) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
  });

  return next;
};

// Trang, tab, từ khóa lưu trên URL → F5 không bị mất, dùng được nút Back
export const useTodoQuery = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchKeyword = searchParams.get('q') ?? '';

  const tabParam = searchParams.get('tab');
  const filterTab = FILTER_TABS.includes(tabParam) ? tabParam : 'all';

  const pageParam = Number(searchParams.get('page'));
  const currentPage = Number.isInteger(pageParam) && pageParam >= 1 ? pageParam : 1;

  const updateQuery = (changes, options) => {
    setSearchParams((prev) => applyQueryChanges(prev, changes), options);
  };

  return { 
    searchKeyword, 
    filterTab, 
    currentPage, 
    updateQuery 
  };
};
