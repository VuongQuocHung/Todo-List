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
    <div className="todo-state-box">
      <div className="todo-state-icon">
        <ClipboardCheck size={28} />
      </div>

      <h3 className="todo-state-title">
        {searchKeyword ? 'Không tìm thấy công việc phù hợp' : EMPTY_TITLES[filterTab]}
      </h3>

      <p className="todo-state-desc">
        {searchKeyword
          ? `Không có kết quả cho từ khóa "${searchKeyword}". Thử tìm kiếm với từ khóa khác.`
          : 'Hãy thêm các mục tiêu và kế hoạch cần làm để theo dõi tiến độ mỗi ngày.'}
      </p>

      <div className="todo-state-action">
        {searchKeyword ? (
          <button
            type="button"
            className="todo-btn-cancel"
            onClick={onClearSearch}
          >
            Xóa tìm kiếm
          </button>
        ) : showCreateButton ? (
          <button
            type="button"
            className="todo-btn-submit"
            onClick={onCreate}
          >
            <Plus size={16} /> Thêm công việc ngay
          </button>
        ) : null}
      </div>
    </div>
  );
};
