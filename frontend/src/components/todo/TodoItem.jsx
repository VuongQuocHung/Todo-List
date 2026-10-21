import {
  Check,
  Calendar,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

import { memo } from 'react';

import { formatDueDate, isOverdue } from '../../utils/todoDate';

import { TodoEditForm } from './TodoEditForm';

const actionButtonClass =
  'flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50';

export const TodoItem = memo(function TodoItem({
  item,
  isEditing, // item này đang mở form sửa
  pendingAction, // 'update' | 'delete' | null — thao tác đang chạy trên item này
  isLocked, // đang có thao tác bất kỳ → khóa các nút
  onStartEdit, // (id) => ...
  onCancelEdit, // () => ...
  onUpdate, // (id, data) => ...
  onDelete, // (id) => ...
}) {
  //console.log('render TodoItem', item.id);

  const isUpdating = pendingAction === 'update';
  const isDeleting = pendingAction === 'delete';
  const overdue = isOverdue(item);

  // Form chỉnh sửa nằm ngay tại vị trí của công việc
  if (isEditing) {
    return (
      <article className="bg-surface-container-low p-3 sm:p-4">
        <TodoEditForm
          item={item}
          onSave={(data) => onUpdate(item.id, data)}
          onCancel={onCancelEdit}
          isSaving={isUpdating}
        />
      </article>
    );
  }

  // Màu ô tick: đã xong → xanh lá; quá hạn → đỏ nhạt; bình thường → xám
  const checkClass = item.completed
    ? 'bg-tertiary text-on-tertiary shadow-sm'
    : overdue
      ? 'bg-error-container hover:bg-error/30'
      : 'bg-surface-container-high hover:bg-secondary-fixed';

  return (
    <article
      className={`group flex items-start justify-between gap-3 p-3 transition-colors hover:bg-surface-container-low sm:px-4 ${
        item.completed ? 'bg-surface-container-lowest/60' : ''
      }`}
    >
      <div className={`flex min-w-0 flex-1 items-start gap-3 ${item.completed ? 'opacity-75' : ''}`}>
        <button
          type="button"
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-colors disabled:cursor-wait disabled:opacity-60 ${checkClass}`}
          onClick={() => onUpdate(item.id, {
            completed: !item.completed
          })}
          disabled={isUpdating}
          title={item.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
          aria-pressed={item.completed}
        >
          {item.completed && <Check size={14} />}
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3
            className={`break-words text-base font-medium ${
              item.completed ? 'text-on-surface-variant line-through' : 'text-on-surface'
            }`}
          >
            {item.title}
          </h3>

          {item.description && (
            <p className="whitespace-pre-wrap break-words text-on-surface-variant">{item.description}</p>
          )}

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-on-surface-variant">
            {item.dueDate && !overdue && (
              <span className="flex items-center gap-1 rounded bg-surface-container px-2 py-0.5">
                <Calendar size={14} />
                <span>Hạn: {formatDueDate(item.dueDate)}</span>
              </span>
            )}

            {overdue && !item.completed && (
              <span className="flex items-center gap-1 rounded bg-error-container/60 px-2 py-0.5 font-medium text-error">
                <AlertTriangle size={14} />
                <span>Quá hạn: {formatDueDate(item.dueDate)}</span>
              </span>
            )}

            {overdue && item.completed && (
              <span className="rounded bg-secondary-container px-2 py-0.5 font-medium text-on-secondary-container">
                Hoàn thành trễ — hạn: {formatDueDate(item.dueDate)}
              </span>
            )}

            {item.completed ? (
              <span className="flex items-center gap-1 font-medium text-tertiary">
                <CheckCircle2 size={14} />
                <span>
                  {item.completedDate
                    ? `Đã hoàn thành ${formatDueDate(item.completedDate)}`
                    : 'Đã hoàn thành'}
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-1 font-medium text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                Đang làm
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-80 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          className={`${actionButtonClass} hover:text-primary`}
          onClick={() => onStartEdit(item.id)}
          disabled={isLocked}
          title="Chỉnh sửa công việc"
          aria-label="Chỉnh sửa công việc"
        >
          <Pencil size={18} />
        </button>

        <button
          type="button"
          className={`${actionButtonClass} hover:text-error`}
          onClick={() => onDelete(item.id)}
          disabled={isLocked}
          title={isDeleting ? 'Đang xóa...' : 'Xóa công việc'}
          aria-label="Xóa công việc"
        >
          {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
        </button>
      </div>
    </article>
  );
});
