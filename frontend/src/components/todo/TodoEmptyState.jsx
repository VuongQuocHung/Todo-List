import { ClipboardCheck, Plus } from 'lucide-react';

// Tiêu đề hiển thị theo từng tab lọc khi không có công việc
const EMPTY_TITLES = {
  all: 'Chưa có công việc nào',
  pending: 'Không có công việc nào đang chờ',
  completed: 'Chưa có công việc nào hoàn thành',
  overdue: 'Tuyệt vời! Không có công việc nào quá hạn',
};

export const TodoEmptyState = ({
  searchKeyword, // từ khóa đã tìm
  filterTab, // 'all' | 'pending' | 'completed' | 'overdue'
  showCreateButton, // !isCreateOpen
  onClearSearch, // handleClearSearch
  onCreate, // mở form tạo công việc
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-xl bg-surface-container-lowest p-8 text-center shadow-sm">
      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-outline">
        <ClipboardCheck size={30} />
      </div>

      <h3 className="mb-1 text-lg font-semibold text-on-surface">
        {searchKeyword ? 'Không tìm thấy công việc phù hợp' : EMPTY_TITLES[filterTab]}
      </h3>

      <p className="mb-3 max-w-sm text-on-surface-variant">
        {searchKeyword
          ? `Không có kết quả cho từ khóa "${searchKeyword}". Thử tìm kiếm với từ khóa khác.`
          : 'Hãy thêm các mục tiêu và kế hoạch cần làm để theo dõi tiến độ mỗi ngày.'}
      </p>

      {searchKeyword ? (
        <button
          type="button"
          className="rounded-lg bg-surface-container-high px-3 py-2 text-xs font-semibold text-on-surface transition-colors hover:bg-surface-variant"
          onClick={onClearSearch}
        >
          Xóa tìm kiếm
        </button>
      ) : showCreateButton ? (
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg bg-secondary-container px-3 py-2 text-xs font-semibold text-on-secondary-container transition-colors hover:bg-secondary-fixed"
          onClick={onCreate}
        >
          <Plus size={16} /> Tạo việc mới ngay
        </button>
      ) : null}
    </div>
  );
};
