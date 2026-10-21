import { TodoItem } from './TodoItem';
import { TodoSkeletonList } from './TodoSkeletonList';

export const TodoList = ({
  todoList,
  isLoading,
  emptyState, // phần tử JSX hiển thị khi danh sách rỗng
  editingId,
  pending, // { id, action } | null — thao tác đang chạy
  onStartEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}) => {
  if (isLoading) {
    return <TodoSkeletonList />;
  }

  if (todoList.length === 0) {
    return emptyState;
  }

  return (
    // divide-y: kẻ 1 đường mảnh giữa các công việc
    <section className="flex w-full flex-col divide-y divide-surface-container-high overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      {todoList.map((item) => (
        <TodoItem
          key={item.id}
          item={item}
          isEditing={editingId === item.id}
          pendingAction={pending?.id === item.id ? pending.action : null}
          isLocked={pending !== null}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
