import { Plus, X } from 'lucide-react';
export const TodoHeader = ({
  totalCount,
  completedCount,
  percentDone,
  isCreateOpen,
  onToggleCreate,
}) => {
  return (
    <header className="flex w-full flex-col items-start justify-between gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-on-surface">Công việc của tôi</h1>

        {totalCount === 0 ? (
          <p className="text-on-surface-variant">Chưa có công việc nào cần làm</p>
        ) : (
          <div className="mt-1 flex w-full max-w-sm items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${percentDone}%` }}
              />
            </div>
            <span className="whitespace-nowrap text-xs font-medium text-on-surface-variant">
              Đã xong <strong className="font-semibold text-on-surface">{completedCount}</strong>/{totalCount} việc ({percentDone}%)
            </span>
          </div>
        )}
      </div>

      {/* Nút bấm chuyển đổi trạng thái (Toggle Button) dùng để mở hoặc thu gọn form tạo công việc. */}
      <button
        type="button"
        className={`inline-flex w-full shrink-0 items-center justify-center gap-1 rounded-lg px-4 py-2 font-medium shadow-sm transition-all duration-150 active:scale-[0.98] sm:w-auto ${
          isCreateOpen
            ? 'bg-surface-container-high text-on-surface hover:bg-surface-variant'
            : 'bg-primary text-on-primary hover:bg-primary-container'
        }`}
        onClick={onToggleCreate}
      >
        {isCreateOpen ? (
          <>
            <X size={18} />
            <span>Đóng form</span>
          </>
        ) : (
          <>
            <Plus size={18} />
            <span>Thêm công việc</span>
          </>
        )}
      </button>
    </header>
  )
}
