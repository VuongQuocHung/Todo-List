// Khung xương giả lập danh sách trong lúc đang tải dữ liệu
export const TodoSkeletonList = ({ count = 3 }) => {
  return (
    <div className="todo-skeleton-list">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="todo-skeleton-card"></div>
      ))}
    </div>
  );
};
