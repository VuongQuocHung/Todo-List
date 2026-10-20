import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { handleError, getErrorMessage } from '../lib/errorHandler';


const FILTER_TABS = ['all', 'pending', 'completed', 'overdue'];

// Tạo query mới từ query cũ + các thay đổi.
// Giá trị mặc định (trang 1, tab all, từ khóa rỗng) thì xóa khỏi URL cho gọn.
const applyQueryChanges = (prev, changes) => {
  const next = new URLSearchParams(prev);

  Object.entries(changes).forEach(([key, value]) => {
    const isDefault =
      value === '' ||
      (key === 'page' && value === 1) ||
      (key === 'tab' && value === 'all');

    if (isDefault) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
  });

  return next;
};


export const TodoApp = () => {
  // State kiểm soát trạng thái Ẩn / Hiện (Đóng / Mở) của form tạo công việc mới
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // State danh sách công việc
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  // Trang, tab, từ khóa lưu trên URL → F5 không bị mất, dùng được nút Back
  const [searchParams, setSearchParams] = useSearchParams();

  const searchKeyword = searchParams.get('q') ?? '';

  const tabParam = searchParams.get('tab');
  const filterTab = FILTER_TABS.includes(tabParam) ? tabParam : 'all';

  const pageParam = Number(searchParams.get('page'));
  const currentPage = Number.isInteger(pageParam) && pageParam >= 1 ? pageParam : 1;

  const updateQuery = (changes, options) => {
    setSearchParams((prev) => applyQueryChanges(prev, changes), options);
  };

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

  // Thao tác đang chạy: { 
  // id, 
  // action: 'update' | 'delete' 
  // } hoặc null
  const [pending, setPending] = useState(null);



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
    if (pending !== null) {
      return false;
    }

    setPending({ 
      id, 
      action: 'update' 
    });

    try {
      await updateTodo(id, updateData);

      setReloadKey((value) => value + 1);

      return true;
      
    } catch (error) {
      handleError(error);
      return false;
    } finally {
      setPending(null);
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
    if (pending !== null) {
      return;
    }

    if (!window.confirm('Bạn muốn xóa công việc này?')) {
      return;
    }

    setPending({ 
      id, 
      action: 'delete' 
    });

    try {
      await deleteTodo(id);

      setReloadKey((value) => value + 1);

      // Nếu đang sửa đúng công việc vừa xóa thì đóng form
      setEditingId((prev) => (prev === id ? null : prev));

      toast.success('Xóa công việc thành công');
    } catch (error) {
      handleError(error);
    } finally {
      setPending(null);
    }
  };

  const handleCreateTodo = async (todoData) => {
    const newTodo = await createTodo(todoData);

    updateQuery({ page: 1 });
    setReloadKey((value) => value + 1);

    return newTodo;
  };

  const handleSearch = (value) => {
    handleCancelEdit();
    updateQuery({ q: value, page: 1 });
  };

  const handleClearSearch = () => {
    updateQuery({ q: '', page: 1 });
  };


  // Thống kê & Lọc danh sách
  const totalCount = stats.all;
  const completedCount = stats.completed;
  const percentDone = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handlePageChange = (page) => {
    handleCancelEdit(); // đóng form sửa trước khi chuyển trang.
    updateQuery({ page });
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
          // replace: thay URL hiện tại, không thêm vào lịch sử → Back không quay về trang không tồn tại
          setSearchParams((prev) => applyQueryChanges(prev, { page: lastPage }), { replace: true });
        }
      } catch (error) {
        if (controller.signal.aborted) {
          return; // request bị hủy vì đã có request mới hơn → không phải lỗi
        }
        handleError(error, { 
          silent: true 
        }); // xử lý 401 + log; không toast vì đã có banner
        
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
  }, [searchKeyword, currentPage, filterTab, reloadKey, setSearchParams]);


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
            searchKeyword={searchKeyword}
            onSearch={handleSearch}
            onClear={handleClearSearch}
          />
          <TodoFilterTabs
            filterTab={filterTab}
            stats={stats}
            onFilterChange={(tab) => updateQuery({ tab, page: 1 })}
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
                  pendingAction={pending?.id === item.id ? pending.action : null}
                  isLocked={pending !== null}
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
