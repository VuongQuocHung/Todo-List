import {
  Check,
  Calendar,
  Pencil,
  Trash2,
  AlertCircle,
} from 'lucide-react';

import { formatDueDate, isOverdue } from '../../utils/todoDate';

import { TodoEditForm } from './TodoEditForm';


export const TodoItem = ({
  item,
  isEditing, // item này đang mở form sửa
  isUpdating, // item này đang cập nhật
  isDeleting, // item này đang xóa
  isDisabledActions, // đang có thao tác bất kỳ → khóa nút Sửa/Xóa
  onStartEdit, // (id) => ...
  onCancelEdit, // () => ...
  onUpdate, // (id, data) => ... dùng cho cả lưu chỉnh sửa và tick hoàn thành
  onDelete, // (id) => ...
}) => {
  return (
    <article
      className={`todo-card ${item.completed ? 'is-completed' : ''} ${isOverdue(item) ? 'is-overdue' : ''} ${isEditing ? 'is-editing' : ''}`}
    >
      {isEditing ? (
        /* Form chỉnh sửa trong card */
        <TodoEditForm
          item={item}
          onSave={(data) => onUpdate(item.id, data)}
          onCancel={onCancelEdit}
          isSaving={isUpdating}
        />
      ) : (
        /* Hiển thị công việc bình thường */
        <>
          <button
            type="button"
            className={`todo-check-btn ${item.completed ? 'is-checked' : ''}`}
            onClick={() => onUpdate(item.id, { 
              completed: !item.completed 
            })}
            disabled={isUpdating}
            title={item.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
          >
            {item.completed && <Check size={13} />}
          </button>

          <div className="todo-card-main">
            <h3 className="todo-card-title">{item.title}</h3>

            {item.description && (
              <p className="todo-card-desc">{item.description}</p>
            )}

            <div className="todo-card-meta">
              {item.dueDate && (
                <span className={`todo-tag ${isOverdue(item) ? 'todo-tag-overdue' : 'todo-tag-date'}`}>
                  {isOverdue(item) ? (
                    <AlertCircle size={13} />
                  ) : (
                    <Calendar size={13} />
                  )}
                  <span>{isOverdue(item) ? (item.completed ? 'Hoàn thành trễ — hạn: ' : 'Quá hạn: ') : 'Hạn: '}{formatDueDate(item.dueDate)}</span>
                </span>
              )}

              {item.completed && (
                <span className="todo-tag todo-tag-date">
                  {item.completedDate
                    ? `Hoàn thành: ${formatDueDate(item.completedDate)}`
                    : 'Chưa có ngày hoàn thành'}
                </span>
              )}

              <span className={`todo-tag ${item.completed ? 'todo-tag-completed' : 'todo-tag-pending'}`}>
                {item.completed ? '✓ Đã hoàn thành' : '● Đang làm'}
              </span>
            </div>
          </div>

          <div className="todo-card-actions">
            <button
              type="button"
              className="todo-action-btn todo-action-edit"
              onClick={() => onStartEdit(item.id)}

              disabled={isDisabledActions}
              title="Chỉnh sửa công việc"
            >
              <Pencil size={14} />
              <span>Sửa</span>
            </button>

            <button
              type="button"
              className="todo-action-btn todo-action-delete"
              onClick={() => onDelete(item.id)}

              disabled={isDisabledActions}
              title="Xóa công việc"
            >
              <Trash2 size={14} />
              <span>{isDeleting ? 'Đang xóa...' : 'Xóa'}</span>
            </button>
          </div>
        </>
      )}
    </article>

)
}
