// Khung xương giả lập danh sách trong lúc đang tải dữ liệu
export const TodoSkeletonList = ({ count = 3 }) => {
  return (
    <div className="flex w-full flex-col gap-2 rounded-xl bg-surface-container-lowest p-3 shadow-sm">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {index > 0 && <div className="mb-2 h-px bg-surface-container-high"></div>}
          <div className="flex animate-pulse items-center gap-3 py-1">
            <div className="h-5 w-5 rounded bg-surface-container-highest"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-surface-container-highest"></div>
              <div className="h-3 w-1/2 rounded bg-surface-container-highest"></div>
            </div>
            <div className="h-6 w-16 rounded bg-surface-container-highest"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
