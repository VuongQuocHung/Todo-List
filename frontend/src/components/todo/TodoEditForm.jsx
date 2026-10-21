import { useState } from 'react';
import { AlertCircle, CalendarDays, FilePen } from 'lucide-react';
import { toast } from 'sonner';

const labelClass = 'mb-1 block text-[11px] font-semibold text-on-surface';
const errorTextClass = 'mt-1 flex items-center gap-1 text-xs text-error';

const getFieldClass = (error) =>
  `w-full rounded bg-surface-container-low px-3 py-1.5 text-on-surface outline-none disabled:opacity-60 ${
    error ? 'ring-2 ring-error' : 'focus:ring-2 focus:ring-primary/20'
  }`;

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
    <form className="flex flex-col gap-2 rounded-lg bg-surface-container-lowest p-3 shadow-sm" onSubmit={handleSubmit}>
      <span className="flex items-center gap-1 text-xs font-semibold text-primary">
        <FilePen size={16} />
        Chỉnh sửa công việc
      </span>

      <div>
        <label className={labelClass} htmlFor={`edit-title-${item.id}`}>
          Tiêu đề <span className="text-error">*</span>
        </label>
        <input
          id={`edit-title-${item.id}`}
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Nhập tiêu đề công việc"
          disabled={isSaving}
          className={getFieldClass(errors.title)}
        />
        {errors.title && (
          <p className={errorTextClass}>
            <AlertCircle size={14} /> {errors.title}
          </p>
        )}
      </div>

      <div>
        <label className={labelClass} htmlFor={`edit-description-${item.id}`}>
          Mô tả
        </label>
        <textarea
          id={`edit-description-${item.id}`}
          rows={2}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Nhập mô tả"
          disabled={isSaving}
          className={`${getFieldClass(errors.description)} resize-none`}
        />
        {errors.description && (
          <p className={errorTextClass}>
            <AlertCircle size={14} /> {errors.description}
          </p>
        )}
      </div>

      <div className="flex flex-col justify-between gap-2 pt-1 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1">
          <CalendarDays size={16} className="text-on-surface-variant" />
          <label className="sr-only" htmlFor={`edit-due-date-${item.id}`}>
            Hạn hoàn thành
          </label>
          <input
            id={`edit-due-date-${item.id}`}
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            disabled={isSaving}
            className="rounded bg-surface-container-low px-2 py-1 text-xs text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            className="rounded bg-surface-container-high px-3 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-50"
            onClick={onCancel}
            disabled={isSaving}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
          >
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </form>
  );
};
