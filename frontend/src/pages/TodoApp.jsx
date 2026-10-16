import { useEffect, useState } from "react";
import { toast } from "sonner";

const vnDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const formatDueDate = (dateStr) => {
  if (!dateStr) return '';
  const clean = dateStr.slice(0, 10);
  const parts = clean.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

export const TodoApp = () => {
  // State form tạo công việc
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State danh sách công việc
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [keyword, setKeyword] = useState('');

  // State form chỉnh sửa công việc
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editErrors, setEditErrors] = useState({});

  // State theo dõi tiến trình
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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

  const handleCreate = async (event) => {
    event.preventDefault();
    if (isLoading || isSubmitting || !validateCreateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          dueDate: dueDate || null,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error?.message || 'Không tạo được công việc');
      }

      setTodoList((currentList) => [result.data, ...currentList]);

      setTitle('');
      setDescription('');
      setDueDate('');
      setErrors({});

      toast.success('Tạo công việc thành công');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.dueDate || '');
    setEditErrors({});
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    setEditDueDate('');
    setEditErrors({});
  };

  const handleUpdateTodo = async (id, updateData) => {
    if (updatingId !== null) {
      return false;
    }

    setUpdatingId(id);

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error?.message || 'Không cập nhật được công việc');
      }

      setTodoList((currentList) =>
        currentList.map((item) => (item.id === id ? result.data : item))
      );

      return true;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSaveEdit = async (id) => {
    const trimmedTitle = editTitle.trim();
    const trimmedDesc = editDescription.trim();
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
      setEditErrors(nextErrors);
      toast.error('Vui lòng kiểm tra lại thông tin chỉnh sửa');
      return;
    }

    const isSuccess = await handleUpdateTodo(id, {
      title: trimmedTitle,
      description: trimmedDesc || null,
      dueDate: editDueDate || null,
    });

    if (isSuccess) {
      toast.success('Chỉnh sửa công việc thành công');
      handleCancelEdit();
    }
  };

  const handleToggleStatus = async (item, completed) => {
    const isSuccess = await handleUpdateTodo(item.id, { completed });
    if (isSuccess) {
      toast.success('Cập nhật trạng thái thành công');
    }
  };

  const isOverdue = (todo) => {
    if (!todo.dueDate || todo.completed) {
      return false;
    }

    const today = vnDateFormatter.format(new Date());
    return todo.dueDate < today;
  };

  const handleDelete = async (id) => {
    if (deletingId !== null) {
      return;
    }

    if (!window.confirm('Bạn muốn xóa công việc này?')) {
      return;
    }

    setDeletingId(id);

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error?.message || 'Không xóa được công việc');
      }

      setTodoList((currentList) =>
        currentList.filter((item) => item.id !== id)
      );

      if (editingId === id) {
        handleCancelEdit();
      }

      toast.success('Xóa công việc thành công');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    let ignore = false;

    const loadTodos = async () => {
      try {
        const response = await fetch('/api/todos', {
          credentials: 'include',
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(result?.error?.message || 'Không tải được công việc');
        }

        if (!ignore) {
          setTodoList(result.data || []);
        }
      } catch (error) {
        if (!ignore) {
          setLoadError(error.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadTodos();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredTodos = todoList.filter((item) =>
    item.title.toLowerCase().includes(keyword.trim().toLowerCase())
  );

  return (
    <main className="todo">
      <h1>Công việc của tôi</h1>

      <form className="todo-form" onSubmit={handleCreate} noValidate>
        <div className="register-field">
          <label htmlFor="todo-title">Tiêu đề *</label>
          <input
            id="todo-title"
            name="title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Nhập tiêu đề công việc"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="register-field-error">{errors.title}</p>
          )}
        </div>

        <div className="register-field">
          <label htmlFor="todo-due-date">Hạn hoàn thành (không bắt buộc)</label>
          <input
            id="todo-due-date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="register-field">
          <label htmlFor="todo-description">Mô tả (không bắt buộc)</label>
          <textarea
            id="todo-description"
            name="description"
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Nhập mô tả công việc"
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="register-field-error">{errors.description}</p>
          )}
        </div>

        <button
          type="submit"
          className="register-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Đang tạo...' : 'Tạo công việc'}
        </button>
      </form>

      <section className="todo__list">
        <h2>Danh sách công việc</h2>

        <div className="register-field">
          <label htmlFor="todo-search">Tìm công việc</label>
          <input
            id="todo-search"
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Nhập tiêu đề cần tìm..."
          />
        </div>

        {isLoading ? (
          <p>Đang tải công việc...</p>
        ) : loadError ? (
          <p role="alert" className="register-field-error">{loadError}</p>
        ) : (
          <>
            {filteredTodos.length === 0 && (
              <p>
                {keyword.trim()
                  ? 'Không tìm thấy công việc phù hợp.'
                  : 'Chưa có công việc nào.'}
              </p>
            )}

            {filteredTodos.map((item) => (
              <article
                key={item.id}
                className={`todo-card ${editingId === item.id ? 'is-editing' : ''}`}
              >
                {editingId === item.id ? (
                  <div className="todo-edit-form">
                    <h4>Chỉnh sửa công việc</h4>

                    <div className="register-field">
                      <label htmlFor={`edit-title-${item.id}`}>Tiêu đề *</label>
                      <input
                        id={`edit-title-${item.id}`}
                        type="text"
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        placeholder="Nhập tiêu đề"
                        disabled={updatingId === item.id}
                      />
                      {editErrors.title && (
                        <p className="register-field-error">{editErrors.title}</p>
                      )}
                    </div>

                    <div className="register-field">
                      <label htmlFor={`edit-due-date-${item.id}`}>Hạn hoàn thành</label>
                      <input
                        id={`edit-due-date-${item.id}`}
                        type="date"
                        value={editDueDate}
                        onChange={(event) => setEditDueDate(event.target.value)}
                        disabled={updatingId === item.id}
                      />
                    </div>

                    <div className="register-field">
                      <label htmlFor={`edit-description-${item.id}`}>Mô tả</label>
                      <textarea
                        id={`edit-description-${item.id}`}
                        rows={3}
                        value={editDescription}
                        onChange={(event) => setEditDescription(event.target.value)}
                        placeholder="Nhập mô tả"
                        disabled={updatingId === item.id}
                      />
                      {editErrors.description && (
                        <p className="register-field-error">{editErrors.description}</p>
                      )}
                    </div>

                    <div className="todo-edit-actions">
                      <button
                        type="button"
                        className="todo-btn todo-btn-save"
                        onClick={() => handleSaveEdit(item.id)}
                        disabled={updatingId === item.id}
                      >
                        {updatingId === item.id ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>

                      <button
                        type="button"
                        className="todo-btn todo-btn-cancel"
                        onClick={handleCancelEdit}
                        disabled={updatingId === item.id}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3>{item.title}</h3>

                    {item.description && <p>{item.description}</p>}

                    <p>
                      Hạn hoàn thành:{' '}
                      {item.dueDate ? formatDueDate(item.dueDate) : 'Chưa đặt hạn'}
                      {isOverdue(item) && (
                        <strong style={{ color: '#dc2626' }}> — Quá hạn</strong>
                      )}
                    </p>

                    <div className="todo-card-actions">
                      <label className="todo-status-label">
                        Trạng thái:{' '}
                        <select
                          value={String(item.completed)}
                          disabled={updatingId !== null}
                          onChange={(event) =>
                            handleToggleStatus(item, event.target.value === 'true')
                          }
                        >
                          <option value="false">Chưa hoàn thành</option>
                          <option value="true">Đã hoàn thành</option>
                        </select>
                      </label>

                      {updatingId === item.id && <span> Đang lưu...</span>}

                      <button
                        type="button"
                        className="todo-btn todo-btn-edit"
                        onClick={() => handleStartEdit(item)}
                        disabled={updatingId !== null || deletingId !== null}
                      >
                        Sửa
                      </button>

                      <button
                        type="button"
                        className="todo-btn todo-btn-delete"
                        onClick={() => handleDelete(item.id)}
                        disabled={updatingId !== null || deletingId !== null}
                      >
                        {deletingId === item.id ? 'Đang xóa...' : 'Xóa'}
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </>
        )}
      </section>
    </main>
  );
};