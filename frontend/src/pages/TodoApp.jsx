import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  X,
  Check,
  Calendar,
  Search,
  Pencil,
  Trash2,
  AlertCircle,
  ClipboardCheck,
} from "lucide-react";

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
  // State hiển thị toggle đóng/mở
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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

  // State lọc
  const [keyword, setKeyword] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'pending' | 'completed' | 'overdue'

  // State form chỉnh sửa công việc
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editErrors, setEditErrors] = useState({});

  // State theo dõi tiến trình cập nhật/xóa
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

  const matchesSearch = (todo) => {
    return todo.title
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
  };

  const handleToggleCreate = () => { // Bật tắt form tạo công việc
    setIsCreateOpen((prev) => !prev); // đang đóng thì bấm sẽ mở, đang mở thì bấm sẽ đóng lại.
    if (isCreateOpen) {
      setErrors({});
    }
  };

  const handleCancelCreate = () => { // Hủy tạo công việc
    setIsCreateOpen(false);
    setTitle('');
    setDescription('');
    setDueDate('');
    setErrors({});
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

      if (matchesSearch(result.data)) {
        setTodoList((currentList) => [
          result.data,
          ...currentList,
        ]);
      }

      setTitle('');
      setDescription('');
      setDueDate('');
      setErrors({});
      setIsCreateOpen(false); // Đóng form sau khi tạo thành công

      toast.success('Tạo công việc thành công');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (todo) => { // Chỉnh sửa một công việc đã có
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.dueDate || '');
    setEditErrors({});
  };

  const handleCancelEdit = () => { // Hủy chỉnh sửa công việc
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    setEditDueDate('');
    setEditErrors({});
  };

  const handleUpdateTodo = async (id, updateData) => { // Cập nhật dữ liệu công việc
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
        currentList
          .map((item) => item.id === id ? result.data : item)
          .filter((item) => matchesSearch(item))
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
      toast.success(completed ? 'Đã hoàn thành công việc' : 'Đã chuyển về chưa hoàn thành');
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

  const handleSearch = (event) => {
    event.preventDefault();
    handleCancelEdit();
    setSearchKeyword(keyword.trim());
  };

  const handleClearSearch = () => {
    setKeyword('');
    setSearchKeyword('');
  };

  useEffect(() => {
    let ignore = false;

    const loadTodos = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const params = new URLSearchParams({
          keyword: searchKeyword,
        });

        const response = await fetch(`/api/todos?${params.toString()}`, {
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
          setTodoList([]);
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
  }, [searchKeyword]);

  // Thống kê & Lọc danh sách
  const totalCount = todoList.length;
  const completedCount = todoList.filter((item) => item.completed).length;
  const pendingCount = totalCount - completedCount;
  const overdueCount = todoList.filter((item) => isOverdue(item)).length;
  const percentDone = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredList = todoList.filter((item) => {
    if (filterTab === 'pending') return !item.completed;
    if (filterTab === 'completed') return item.completed;
    if (filterTab === 'overdue') return isOverdue(item);
    return true;
  });

  return (
    <main className="todo-page">
      <div className="todo-container">
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
              onClick={handleToggleCreate}
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

        {/* Form tạo công việc mới */}
        {isCreateOpen && (
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
                onClick={handleCancelCreate}
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang tạo...' : 'Tạo công việc'}
                  </button>
                  <button
                    type="button"
                    className="todo-btn-cancel"
                    onClick={handleCancelCreate}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </form>
          </section>
        )}

        {/* Toolbar: Search & Filter Tabs */}
        <section className="todo-toolbar">
          <form className="todo-search-bar" onSubmit={handleSearch}>
            <div className="todo-search-input-wrap">
              <span className="todo-search-icon">
                <Search size={16} />
              </span>
              <input
                id="todo-search"
                className="todo-search-input"
                type="text"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm theo tiêu đề công việc..."
              />
              {keyword && (
                <button
                  type="button"
                  className="todo-search-clear"
                  onClick={handleClearSearch}
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className="todo-btn-search">
              Tìm kiếm
            </button>
          </form>

          <div className="todo-filter-tabs">
            <button
              type="button"
              className={`todo-filter-tab ${filterTab === 'all' ? 'is-active' : ''}`}
              onClick={() => setFilterTab('all')}
            >
              Tất cả
              <span className="todo-tab-count">{totalCount}</span>
            </button>
            <button
              type="button"
              className={`todo-filter-tab ${filterTab === 'pending' ? 'is-active' : ''}`}
              onClick={() => setFilterTab('pending')}
            >
              Chưa hoàn thành
              <span className="todo-tab-count">{pendingCount}</span>
            </button>
            <button
              type="button"
              className={`todo-filter-tab ${filterTab === 'completed' ? 'is-active' : ''}`}
              onClick={() => setFilterTab('completed')}
            >
              Đã hoàn thành
              <span className="todo-tab-count">{completedCount}</span>
            </button>
            {overdueCount > 0 && (
              <button
                type="button"
                className={`todo-filter-tab ${filterTab === 'overdue' ? 'is-active' : ''}`}
                onClick={() => setFilterTab('overdue')}
              >
                Quá hạn
                <span className="todo-tab-count" style={{ background: filterTab === 'overdue' ? 'rgba(255,255,255,0.3)' : '#fee2e2', color: filterTab === 'overdue' ? '#fff' : '#dc2626' }}>
                  {overdueCount}
                </span>
              </button>
            )}
          </div>
        </section>

        {/* Main Todo List Area */}
        {loadError && (
          <div className="todo-error-banner">
            <AlertCircle size={16} />
            <span>{loadError}</span>
          </div>
        )}

        {isLoading ? (
          <div className="todo-skeleton-list">
            <div className="todo-skeleton-card"></div>
            <div className="todo-skeleton-card"></div>
            <div className="todo-skeleton-card"></div>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="todo-state-box">
            <div className="todo-state-icon">
              <ClipboardCheck size={28} />
            </div>
            <h3 className="todo-state-title">
              {searchKeyword
                ? 'Không tìm thấy công việc phù hợp'
                : filterTab === 'completed'
                  ? 'Chưa có công việc nào hoàn thành'
                  : filterTab === 'pending'
                    ? 'Không có công việc nào đang chờ'
                    : filterTab === 'overdue'
                      ? 'Tuyệt vời! Không có công việc nào quá hạn'
                      : 'Chưa có công việc nào'}
            </h3>
            <p className="todo-state-desc">
              {searchKeyword
                ? `Không có kết quả cho từ khóa "${searchKeyword}". Thử tìm kiếm với từ khóa khác.`
                : 'Hãy thêm các mục tiêu và kế hoạch cần làm để theo dõi tiến độ mỗi ngày.'}
            </p>
            <div className="todo-state-action">
              {searchKeyword ? (
                <button
                  type="button"
                  className="todo-btn-cancel"
                  onClick={handleClearSearch}
                >
                  Xóa tìm kiếm
                </button>
              ) : !isCreateOpen ? (
                <button
                  type="button"
                  className="todo-btn-submit"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <Plus size={16} /> Thêm công việc ngay
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="todo-cards-list">
            {filteredList.map((item) => (
              <article
                key={item.id}
                className={`todo-card ${item.completed ? 'is-completed' : ''} ${isOverdue(item) ? 'is-overdue' : ''} ${editingId === item.id ? 'is-editing' : ''}`}
              >
                {editingId === item.id ? (
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
                          disabled={updatingId === item.id}
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
                          onChange={(event) => setEditDueDate(event.target.value)}
                          disabled={updatingId === item.id}
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
                          onChange={(event) => setEditDescription(event.target.value)}
                          placeholder="Nhập mô tả"
                          disabled={updatingId === item.id}
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
                          onClick={() => handleSaveEdit(item.id)}
                          disabled={updatingId === item.id}
                        >
                          {updatingId === item.id ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>

                        <button
                          type="button"
                          className="todo-btn-cancel"
                          onClick={handleCancelEdit}
                          disabled={updatingId === item.id}
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
                      onClick={() => handleToggleStatus(item, !item.completed)}
                      disabled={updatingId === item.id}
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
                        onClick={() => handleStartEdit(item)}
                        disabled={updatingId !== null || deletingId !== null}
                        title="Chỉnh sửa công việc"
                      >
                        <Pencil size={14} />
                        <span>Sửa</span>
                      </button>

                      <button
                        type="button"
                        className="todo-action-btn todo-action-delete"
                        onClick={() => handleDelete(item.id)}
                        disabled={updatingId !== null || deletingId !== null}
                        title="Xóa công việc"
                      >
                        <Trash2 size={14} />
                        <span>{deletingId === item.id ? 'Đang xóa...' : 'Xóa'}</span>
                      </button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};