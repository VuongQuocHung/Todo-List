import {
  Check,
  Calendar,
  Pencil,
  Trash2,
  AlertCircle,
} from 'lucide-react';

import { formatDueDate, isOverdue } from '../../utils/todoDate';

export const TodoItem = ({
  item, // item
  isEditing, // editingId === item.id
  editTitle,
  editDescription,
  editDueDate,
  editErrors,
  onEditTitleChange, // setEditTitle
  onEditDescriptionChange, // setEditDescription
  onEditDueDateChange, // setEditDueDate
  isUpdating, // updatingId === item.id
  isDeleting, // deletingId === item.id
  isDisabledActions, // updatingId !== null || deletingId !== null
  onStartEdit, // {() => handleStartEdit(item)
  onCancelEdit, // handleCancelEdit
  onSaveEdit, // {() => handleSaveEdit(item.id)
  onToggleStatus, // {(completed) => handleToggleStatus(item, completed)
  onDelete, // {() => handleDelete(item.id)
}) => {
  return (
    <article
      key={item.id}
      className={`todo-card ${item.completed ? 'is-completed' : ''} ${isOverdue(item) ? 'is-overdue' : ''} ${isEditing ? 'is-editing' : ''}`}
    >
      {isEditing ? (
        /* Form chỉnh sửa trong card */
        <div className="todo-edit-form">
          <div className="todo-edit-header">
            Chỉnh sửa công việc
          </div>

          <div className="todo-edit-grid">
            <div className="todo-field">
              <label htmlFor={`edit-title-${item.id}`}>
                Tiêu đề <span className="todo-field-req">*</span>
              </label>
              <input
                id={`edit-title-${item.id}`}
                type="text"
                value={editTitle}
                onChange={(event) => setEditTitle(event.target.value)}
                placeholder="Nhập tiêu đề công việc"
                disabled={isUpdating}
                className={editErrors.title ? 'has-error' : ''}
              />
              {editErrors.title && (
                <p className="todo-error-text">
                  <AlertCircle size={14} /> {editErrors.title}
                </p>
              )}
            </div>

            <div className="todo-field">
              <label htmlFor={`edit-due-date-${item.id}`}>
                Hạn hoàn thành
              </label>
              <input
                id={`edit-due-date-${item.id}`}
                type="date"
                value={editDueDate}
                onChange={(event) => onEditDueDateChange(event.target.value)}
                disabled={isUpdating}
              />
            </div>

            <div className="todo-field">
              <label htmlFor={`edit-description-${item.id}`}>
                Mô tả
              </label>
              <textarea
                id={`edit-description-${item.id}`}
                rows={3}
                value={editDescription}
                onChange={(event) => onEditDescriptionChange(event.target.value)}
                placeholder="Nhập mô tả"
                disabled={isUpdating}
                className={editErrors.description ? 'has-error' : ''}
              />
              {editErrors.description && (
                <p className="todo-error-text">
                  <AlertCircle size={14} /> {editErrors.description}
                </p>
              )}
            </div>

            <div className="todo-edit-actions">
              <button
                type="button"
                className="todo-btn-save"
                onClick={onSaveEdit}
                disabled={isUpdating}
              >
                {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>

              <button
                type="button"
                className="todo-btn-cancel"
                onClick={onCancelEdit}
                disabled={isUpdating}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Hiển thị công việc bình thường */
        <>
          <button
            type="button"
            className={`todo-check-btn ${item.completed ? 'is-checked' : ''}`}
            onClick={() => onToggleStatus(item, !item.completed)}
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
                  <span>{isOverdue(item) ? 'Quá hạn: ' : 'Hạn: '}{formatDueDate(item.dueDate)}</span>
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
              onClick={onStartEdit}
              disabled={isDisabledActions}
              title="Chỉnh sửa công việc"
            >
              <Pencil size={14} />
              <span>Sửa</span>
            </button>

            <button
              type="button"
              className="todo-action-btn todo-action-delete"
              onClick={onDelete}
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
