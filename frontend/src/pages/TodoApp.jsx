import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { useTodoQuery } from '../hooks/useTodoQuery';
import { useTodos } from '../hooks/useTodos';
import { useTodoMutations } from '../hooks/useTodoMutations';
import { getErrorMessage } from '../lib/errorHandler';

import { TodoHeader } from '../components/todo/TodoHeader';
import { TodoCreateForm } from '../components/todo/TodoCreateForm';
import { TodoSearchBar } from '../components/todo/TodoSearchBar';
import { TodoFilterTabs } from '../components/todo/TodoFilterTabs';
import { TodoErrorBanner } from '../components/todo/TodoErrorBanner';
import { TodoList } from '../components/todo/TodoList';
import { TodoEmptyState } from '../components/todo/TodoEmptyState';
import { TodoPagination } from '../components/todo/TodoPagination';

export const TodoApp = () => {
  // State giao diện
  const [isCreateOpen, setIsCreateOpen] = useState(false); // form tạo công việc đang mở?
  const [editingId, setEditingId] = useState(null); // id công việc đang sửa

  // Trang / tab / từ khóa (lưu trên URL)
  const { searchKeyword, filterTab, currentPage, updateQuery } = useTodoQuery();

  // Danh sách công việc: SWR tự lo tải, cache, lỗi, tải lại
  const { todoList, totalPages, stats, isLoading, error } = useTodos({
    keyword: searchKeyword,
    page: currentPage,
    filterTab,
    // Trang hiện tại không còn tồn tại → lùi về trang cuối (replace: Back không quay lại trang đó)
    onPageOverflow: (lastPage) => updateQuery({ page: lastPage }, { replace: true }),
  });

  // Tạo / sửa / xóa: gọi API, khóa nút trong lúc chờ, làm mới danh sách
  const { pending, createTodo, updateTodo, deleteTodo } = useTodoMutations();

  const loadError = error ? getErrorMessage(error, 'Không tải được danh sách công việc') : '';
  const percentDone = stats.all > 0 ? Math.round((stats.completed / stats.all) * 100) : 0;

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  // Dùng chung cho lưu chỉnh sửa và tick hoàn thành
  const handleUpdate = useCallback(async (id, updateData) => {
    const isSuccess = await updateTodo(id, updateData);

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
  }, [updateTodo]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Bạn muốn xóa công việc này?')) {
      return;
    }

    const isSuccess = await deleteTodo(id);

    if (isSuccess) {
      // Nếu đang sửa đúng công việc vừa xóa thì đóng form
      setEditingId((prev) => (prev === id ? null : prev));
      toast.success('Xóa công việc thành công');
    }
  }, [deleteTodo]);

  const handleCreate = async (todoData) => {
    const newTodo = await createTodo(todoData);
    updateQuery({ page: 1 }); // về trang 1 để thấy công việc vừa tạo
    return newTodo;
  };

  const handleSearch = (value) => {
    handleCancelEdit();
    updateQuery({ q: value, page: 1 });
  };

  const handleClearSearch = () => {
    updateQuery({ q: '', page: 1 });
  };

  const handlePageChange = (page) => {
    handleCancelEdit(); // đóng form sửa trước khi chuyển trang
    updateQuery({ page });
  };

  return (
    <main className="todo-page">
      <div className="todo-container">
        <TodoHeader
          totalCount={stats.all}
          completedCount={stats.completed}
          percentDone={percentDone}
          isCreateOpen={isCreateOpen}
          onToggleCreate={() => setIsCreateOpen((prev) => !prev)}
        />

        {isCreateOpen && (
          <TodoCreateForm
            onCreate={handleCreate}
            onClose={() => setIsCreateOpen(false)}
            disabled={isLoading}
          />
        )}

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

        <TodoErrorBanner message={loadError} />

        <TodoList
          todoList={todoList}
          isLoading={isLoading}
          editingId={editingId}
          pending={pending}
          onStartEdit={setEditingId}
          onCancelEdit={handleCancelEdit}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          emptyState={
            <TodoEmptyState
              searchKeyword={searchKeyword}
              filterTab={filterTab}
              showCreateButton={!isCreateOpen}
              onClearSearch={handleClearSearch}
              onCreate={() => setIsCreateOpen(true)}
            />
          }
        />

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
