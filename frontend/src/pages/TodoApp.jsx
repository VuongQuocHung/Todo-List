import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Check,
  Calendar,
  Search,
  Pencil,
  Trash2,
  AlertCircle,
  ClipboardCheck,
} from "lucide-react";

import {
  formatDueDate,
  isOverdue
} from '../utils/todoDate';

import { TodoHeader } from '../components/todo/TodoHeader';

import { TodoCreateForm } from '../components/todo/TodoCreateForm';

import { TodoToolbar } from '../components/todo/TodoToolbar';



export const TodoApp = () => {
  // State kiểm soát trạng thái Ẩn / Hiện (Đóng / Mở) của form tạo công việc mới
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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


  const matchesSearch = (todo) => {
    return todo.title
      .toLowerCase()
      .includes(searchKeyword.toLowerCase());
  };

  const handleToggleCreate = () => { // Bật tắt form tạo công việc
    setIsCreateOpen((prev) => !prev); // đang đóng thì bấm sẽ mở, đang mở thì bấm sẽ đóng lại.
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

  const handleCreateTodo = async (todoData) => {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(todoData),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        result?.error?.message ||
        'Không tạo được công việc'
      );
    }

    const newTodo = result.data;

    if (matchesSearch(newTodo)) {
      setTodoList((currentList) => [
        newTodo,
        ...currentList,
      ]);
    }

    return newTodo;
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
        {/* Header: Thống kê & Nút bấm chuyển đổi trạng thái */}
        <TodoHeader
          totalCount={totalCount}
          completedCount={completedCount}
          percentDone={percentDone}
          isCreateOpen={isCreateOpen}
          onToggleCreate={handleToggleCreate}
        />

        {/* Form tạo công việc mới */}
        {isCreateOpen && (
          <TodoCreateForm
            onCreate={handleCreateTodo}
            onClose={() => setIsCreateOpen(false)}
            disabled={isLoading}
          />
        )}

        {/* Toolbar: Search & Filter Tabs */}
        <TodoToolbar
          keyword={keyword}
          onKeywordChange={setKeyword}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          filterTab={filterTab}
          onFilterChange={setFilterTab}
          totalCount={totalCount}
          pendingCount={pendingCount}
          completedCount={completedCount}
          overdueCount={overdueCount}
        />


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