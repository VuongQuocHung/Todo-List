import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const TodoEditForm = ({
  item, // công việc đang sửa
  onSave, // (data) => ... gửi dữ liệu đã chuẩn hóa lên cha
  onCancel,
  isSaving,
}) => {
  // State của form nằm ngay trong form → gõ phím chỉ form này render lại
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || '');
  const [dueDate, setDueDate] = useState(item.dueDate || '');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDesc = description.trim();
    const nextErrors = {};

    if (!trimmedTitle) {
      nextErrors.title = 'Tiêu đề không được để trống';
    } else if (trimmedTitle.length > 200) {
      nextErrors.title = 'Tiêu đề không được vượt quá 200 ký tự';
    }

    if (trimmedDesc.length > 2000) {
      nextErrors.description = 'Mô tả không được vượt quá 2.000 ký tự';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error('Vui lòng kiểm tra lại thông tin chỉnh sửa');
      return;
    }

    await onSave({
      title: trimmedTitle,
      description: trimmedDesc || null,
      dueDate: dueDate || null,
    });
  };

  return (
    <form className="todo-edit-form" onSubmit={handleSubmit}>
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
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Nhập tiêu đề công việc"
            disabled={isSaving}
            className={errors.title ? 'has-error' : ''}
          />
          {errors.title && (
            <p className="todo-error-text">
              <AlertCircle size={14} /> {errors.title}
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
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            disabled={isSaving}
          />
        </div>

        <div className="todo-field">
          <label htmlFor={`edit-description-${item.id}`}>
            Mô tả
          </label>
          <textarea
            id={`edit-description-${item.id}`}
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Nhập mô tả"
            disabled={isSaving}
            className={errors.description ? 'has-error' : ''}
          />
          {errors.description && (
            <p className="todo-error-text">
              <AlertCircle size={14} /> {errors.description}
            </p>
          )}
        </div>

        <div className="todo-edit-actions">
          <button type="submit" className="todo-btn-save" disabled={isSaving}>
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>

          <button
            type="button"
            className="todo-btn-cancel"
            onClick={onCancel}
            disabled={isSaving}
          >
            Hủy
          </button>
        </div>
      </div>
    </form>
  );
};
