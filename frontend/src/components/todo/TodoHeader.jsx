import { Plus, X } from 'lucide-react';
export const TodoHeader = ({
  totalCount,
  completedCount,
  percentDone,
  isCreateOpen,
  onToggleCreate,
}) => {
  return (
    <>
      <header className="todo-header">
        <div className="todo-header-top">
          <div className="todo-title-group">
            <h1>Công việc của tôi</h1>
            <p className="todo-subtitle">
              {totalCount === 0
                ? 'Chưa có công việc nào cần làm'
                : `Đã hoàn thành ${completedCount}/${totalCount} công việc (${percentDone}%)`}
            </p>
          </div>

          {/* Nút bấm chuyển đổi trạng thái (Toggle Button) dùng để mở hoặc thu gọn form tạo công việc. */}
          <button
            type="button"
            className={`todo-btn-toggle ${isCreateOpen ? 'todo-btn-toggle--close' : 'todo-btn-toggle--open'}`}
            onClick={onToggleCreate}
          >
            {isCreateOpen ? (
              <>
                <X size={16} />
                <span>Đóng form</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Thêm công việc</span>
              </>
            )}
          </button>
        </div>

        {totalCount > 0 && (
          <div className="todo-stats-bar">
            <div className="todo-progress-track">
              <div
                className="todo-progress-fill"
                style={{ width: `${percentDone}%` }}
              />
            </div>
            <span className="todo-stats-text">
              {percentDone}% hoàn thành
            </span>
          </div>
        )}
        </header>
    </>
  )
}