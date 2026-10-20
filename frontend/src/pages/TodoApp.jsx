import { useEffect, useState } from "react";
import { toast } from "sonner";

import { TodoHeader } from '../components/todo/TodoHeader';

import { TodoCreateForm } from '../components/todo/TodoCreateForm';

import { TodoSearchBar } from '../components/todo/TodoSearchBar';
import { TodoFilterTabs } from '../components/todo/TodoFilterTabs';


import { TodoItem } from '../components/todo/TodoItem';

import { TodoPagination } from '../components/todo/TodoPagination';

import { TodoErrorBanner } from '../components/todo/TodoErrorBanner';

import { TodoSkeletonList } from '../components/todo/TodoSkeletonList';

import { TodoEmptyState } from '../components/todo/TodoEmptyState';

import { getTodos, createTodo, updateTodo, deleteTodo } from '../api/todoApi';


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

  // State theo dõi tiến trình cập nhật/xóa
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);


  const handleToggleCreate = () => { // Bật tắt form tạo công việc
    setIsCreateOpen((prev) => !prev); // đang đóng thì bấm sẽ mở, đang mở thì bấm sẽ đóng lại.
  };

  const handleStartEdit = (id) => { // Chỉnh sửa một công việc đã có
    setEditingId(id);
  };

  const handleCancelEdit = () => { // Hủy chỉnh sửa công việc
    setEditingId(null);
  };

  const handleUpdateTodo = async (id, updateData) => { // Cập nhật dữ liệu công việc
    if (updatingId !== null) {
      return false;
    }

    setUpdatingId(id);

    try {
      await updateTodo(id, updateData);

      setReloadKey((value) => value + 1);

      return true;
      
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setUpdatingId(null);
    }
  };
  // Dùng chung cho lưu chỉnh sửa và tick hoàn thành
  const handleUpdate = async (id, updateData) => {
    const isSuccess = await handleUpdateTodo(id, updateData);

    if (!isSuccess) {
      return;
    }

    if ('completed' in updateData) {
      toast.success(updateData.completed ? 'Đã hoàn thành công việc' : 'Đã chuyển về chưa hoàn thành');
    } else {
      toast.success('Chỉnh sửa công việc thành công');
      // Chỉ đóng form nếu đang sửa đúng công việc vừa lưu
      setEditingId((prev) => (prev === id ? null : prev));
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
      await deleteTodo(id);

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

  const handleSearch = () => {
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
    const newTodo = await createTodo(todoData);

    setCurrentPage(1);
    setReloadKey((value) => value + 1);

    return newTodo;
  };

  // Thống kê & Lọc danh sách
  const totalCount = stats.all;
  const completedCount = stats.completed;
  const percentDone = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handlePageChange = (page) => {
    handleCancelEdit(); // đóng form sửa trước khi chuyển trang.
    setCurrentPage(page);
  };

  useEffect(() => {
    // Mỗi lần effect chạy tạo 1 controller; effect chạy lại hoặc unmount → hủy request cũ
    const controller = new AbortController();

    const loadTodos = async () => {
      setIsLoading(true);
      setLoadError('');

      try {
        const result = await getTodos({  
          keyword: searchKeyword, 
          page: currentPage, 
          limit: '5', 
          filterTab 
        },  { 
          signal: controller.signal 
        });

        if (controller.signal.aborted) {
          return;
        }
        setTodoList(result.data);
        setTotalPages(result.pagination.totalPages);
        setStats(result.stats);

        // Xóa/sửa phần tử cuối của trang có thể làm giảm tổng số trang.
        const lastPage = Math.max(1, result.pagination.totalPages);
        if (currentPage > lastPage) {
          setCurrentPage(lastPage);
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return; // request bị hủy vì đã có request mới hơn → không phải lỗi
        }
        setTodoList([]);
        setLoadError(error.message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadTodos();

    return () => {
      controller.abort();
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
        {/* Toolbar: Tìm kiếm & Tab lọc */}
        <section className="todo-toolbar">
          <TodoSearchBar
            keyword={keyword}
            onKeywordChange={setKeyword}
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />
          <TodoFilterTabs
            filterTab={filterTab}
            stats={stats}
            onFilterChange={(tab) => {
              setFilterTab(tab);
              setCurrentPage(1);
            }}
          />
        </section>


        {/* Main Todo List Area */}
        <TodoErrorBanner message={loadError} />

        {isLoading ? (
          <TodoSkeletonList />
        ) : todoList.length === 0 ? (
          <TodoEmptyState
            searchKeyword={searchKeyword}
            filterTab={filterTab}
            showCreateButton={!isCreateOpen}
            onClearSearch={handleClearSearch}
            onCreate={() => setIsCreateOpen(true)}
          />
        ) : (
          <>
            <div className="todo-cards-list">
              {todoList.map((item) => (
                <TodoItem
                  key={item.id}
                  item={item}
                  isEditing={editingId === item.id}
                  isUpdating={updatingId === item.id}
                  isDeleting={deletingId === item.id}
                  isDisabledActions={updatingId !== null || deletingId !== null}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />

              ))}
            </div>
          </>
        )}

        {/* Giao diện phân trang */}
        <TodoPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
};
