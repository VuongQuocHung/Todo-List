import { useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  X,
  AlertCircle,
} from 'lucide-react';
import { handleError } from '../../lib/errorHandler';

export const TodoCreateForm = ({
  onCreate,
  onClose,
  disabled = false,
}) => {
  // State form tạo công việc
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateCreateForm = () => {
    const nextErrors = {};

    if (!title.trim()) {
      nextErrors.title = 'Vui lòng nhập tiêu đề';
    } else if (title.trim().length > 200) {
      nextErrors.title = 'Tiêu đề không được vượt quá 200 ký tự';
    }

    if (description.trim().length > 2000) {
      nextErrors.description = 'Mô tả không được vượt quá 2.000 ký tự';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setErrors({});
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (disabled || isSubmitting || !validateCreateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreate({
        title: title.trim(),
        description: description.trim() || null,
        dueDate: dueDate || null,
      });

      resetForm();
      toast.success('Tạo công việc thành công');
      onClose();
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <section className="todo-create-card">
        <div className="todo-create-header">
          <div className="todo-create-title">
            <span className="todo-create-icon">
              <Plus size={16} />
            </span>
            <span>Thêm công việc mới</span>
          </div>
          <button
            type="button"
            className="todo-icon-btn-close"
            onClick={handleCancel}
            title="Đóng form"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleCreate} noValidate>
          <div className="todo-form-grid">
            <div className="todo-field">
              <label htmlFor="todo-title">
                Tiêu đề <span className="todo-field-req">*</span>
              </label>
              <input
                id="todo-title"
                name="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ví dụ: Hoàn thành báo cáo quý..."
                disabled={isSubmitting}
                className={errors.title ? 'has-error' : ''}
                autoFocus
              />
              {errors.title && (
                <p className="todo-error-text">
                  <AlertCircle size={14} /> {errors.title}
                </p>
              )}
            </div>

            <div className="todo-field">
              <label htmlFor="todo-due-date">
                Hạn hoàn thành <span className="todo-field-opt">(không bắt buộc)</span>
              </label>
              <input
                id="todo-due-date"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="todo-field">
              <label htmlFor="todo-description">
                Mô tả chi tiết <span className="todo-field-opt">(không bắt buộc)</span>
              </label>
              <textarea
                id="todo-description"
                name="description"
                rows={3}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Nhập thông tin hoặc ghi chú bổ sung..."
                disabled={isSubmitting}
                className={errors.description ? 'has-error' : ''}
              />
              {errors.description && (
                <p className="todo-error-text">
                  <AlertCircle size={14} /> {errors.description}
                </p>
              )}
            </div>

            <div className="todo-create-actions">
              <button
                type="submit"
                className="todo-btn-submit"
                disabled={disabled || isSubmitting}
              >
                {isSubmitting ? 'Đang tạo...' : 'Tạo công việc'}
              </button>
              <button
                type="button"
                className="todo-btn-cancel"
                onClick={handleCancel}
                disabled={disabled || isSubmitting}
              >
                Hủy
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  )
}