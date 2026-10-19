import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  AlertCircle,
  ClipboardCheck,
} from "lucide-react";

import { TodoHeader } from '../components/todo/TodoHeader';

import { TodoCreateForm } from '../components/todo/TodoCreateForm';

import { TodoToolbar } from '../components/todo/TodoToolbar';

import { TodoItem } from '../components/todo/TodoItem';
import { TodoPagination } from '../components/todo/TodoPagination';


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

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [reloadKey, setReloadKey] = useState(0); // Tín hiệu tải lại sau khi tạo/sửa/xóa

  const [stats, setStats] = useState({
    all: 0,
    pending: 0,
    completed: 0,
    overdue: 0,
  }); // Số công việc của từng trạng thái trên mọi trang, theo từ khóa tìm kiếm

  // State form chỉnh sửa công việc
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editErrors, setEditErrors] = useState({});

  // State theo dõi tiến trình cập nhật/xóa
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);


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

      setReloadKey((value) => value + 1);

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

      setReloadKey((value) => value + 1);

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
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setKeyword('');
    setSearchKeyword('');
    setCurrentPage(1);
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

    setCurrentPage(1);
    setReloadKey((value) => value + 1);

    return newTodo;
  };

  // Thống kê & Lọc danh sách
  const totalCount = stats.all;
  const completedCount = stats.completed;
  const pendingCount = stats.pending;
  const overdueCount = stats.overdue;
  const percentDone = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handlePageChange = (page) => {
    handleCancelEdit(); // đóng form sửa trước khi chuyển trang.
    setCurrentPage(page);
  };

  useEffect(() => {
    let ignore = false;

    const loadTodos = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const params = new URLSearchParams({
          keyword: searchKeyword,
          page: String(currentPage),
          limit: '5',
          filterTab,
        });

        const response = await fetch(`/api/todos?${params.toString()}`, {
          credentials: 'include',
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(result?.error?.message || 'Không tải được công việc');
        }

        if (!ignore) {
          setTodoList(result.data);
          setTotalPages(result.pagination.totalPages);
          setStats(result.stats);
          // Xóa/sửa phần tử cuối của trang có thể làm giảm tổng số trang.
          const lastPage = Math.max(1, result.pagination.totalPages);
          if (currentPage > lastPage) {
            setCurrentPage(lastPage);
          }
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
  }, [searchKeyword, currentPage, filterTab, reloadKey]);


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
          onFilterChange={(tab) => {
            setFilterTab(tab);
            setCurrentPage(1);
          }}
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
        ) : todoList.length === 0 ? (
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
          <>
            <div className="todo-cards-list">
              {todoList.map((item) => (
                <TodoItem
                  key={item.id}
                  item={item}
                  isEditing={editingId === item.id}
                  editTitle={editTitle}
                  editDescription={editDescription}
                  editDueDate={editDueDate}
                  editErrors={editErrors}
                  onEditTitleChange={setEditTitle}
                  onEditDescriptionChange={setEditDescription}
                  onEditDueDateChange={setEditDueDate}
                  isUpdating={updatingId === item.id}
                  isDeleting={deletingId === item.id}
                  isDisabledActions={updatingId !== null || deletingId !== null}
                  onStartEdit={() => handleStartEdit(item)}
                  onCancelEdit={handleCancelEdit}
                  onSaveEdit={() => handleSaveEdit(item.id)}
                  onToggleStatus={(completed) => handleToggleStatus(item, completed)}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </div>

            {/* Giao diện phân trang */}
            <TodoPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </main>
  );
};
