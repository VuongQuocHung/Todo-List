import { useState } from "react";
import { toast } from "sonner";
import {
  NotebookPen,
  X,
  AlertCircle,
} from 'lucide-react';
import { handleError } from '../../lib/errorHandler';

const labelClass = 'mb-1 block text-xs font-semibold text-on-surface';
const errorTextClass = 'mt-1 flex items-center gap-1 text-xs text-error';

// Ô nhập lỗi → viền đỏ; bình thường → nền xám, focus thì nền trắng
const getFieldClass = (error) =>
  `w-full rounded-lg bg-surface-container-low px-3 py-2 text-on-surface outline-none transition-all placeholder:text-outline focus:bg-surface-container-lowest disabled:opacity-60 ${
    error ? 'ring-2 ring-error' : 'focus:ring-2 focus:ring-primary/20'
  }`;

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
    <section className="flex w-full animate-slide-down flex-col gap-3 rounded-xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-lg font-semibold text-on-surface">
          <NotebookPen size={20} className="text-primary" />
          <span>Tạo công việc mới</span>
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
          onClick={handleCancel}
          title="Đóng form"
        >
          <X size={16} />
        </button>
      </div>

      <form className="flex flex-col gap-2" onSubmit={handleCreate} noValidate>
        <div>
          <label className={labelClass} htmlFor="todo-title">
            Tiêu đề công việc <span className="text-error">*</span>
          </label>
          <input
            id="todo-title"
            name="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ví dụ: Hoàn thành báo cáo quý..."
            disabled={isSubmitting}
            className={getFieldClass(errors.title)}
            autoFocus
          />
          {errors.title && (
            <p className={errorTextClass}>
              <AlertCircle size={14} /> {errors.title}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass} htmlFor="todo-description">
            Mô tả chi tiết
          </label>
          <textarea
            id="todo-description"
            name="description"
            rows={2}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Thêm ghi chú hoặc các bước thực hiện..."
            disabled={isSubmitting}
            className={`${getFieldClass(errors.description)} resize-none`}
          />
          {errors.description && (
            <p className={errorTextClass}>
              <AlertCircle size={14} /> {errors.description}
            </p>
          )}
        </div>

        <div className="pt-1 sm:w-1/2">
          <label className={labelClass} htmlFor="todo-due-date">
            Hạn hoàn thành
          </label>
          <input
            id="todo-due-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            disabled={isSubmitting}
            className={getFieldClass()}
          />
        </div>

        <div className="mt-1 flex items-center justify-end gap-2 border-t border-surface-container-high pt-3">
          <button
            type="button"
            className="rounded-lg px-3 py-1.5 font-medium text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface disabled:opacity-50"
            onClick={handleCancel}
            disabled={disabled || isSubmitting}
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-1.5 font-medium text-on-primary shadow-sm transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-65"
            disabled={disabled || isSubmitting}
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo công việc'}
          </button>
        </div>
      </form>
    </section>
  )
}