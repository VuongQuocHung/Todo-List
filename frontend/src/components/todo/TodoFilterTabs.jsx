// Cấu hình các tab lọc; key trùng với key trong stats từ API
const FILTER_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chưa hoàn thành' },
  { key: 'completed', label: 'Đã hoàn thành' },
  { key: 'overdue', label: 'Quá hạn', hideWhenEmpty: true },
];

// Màu riêng cho số đếm của tab "Quá hạn"
const getOverdueCountStyle = (isActive) => ({
  background: isActive ? 'rgba(255,255,255,0.3)' : '#fee2e2',
  color: isActive ? '#fff' : '#dc2626',
});

export const TodoFilterTabs = ({
  filterTab, // tab đang chọn
  stats, // { all, pending, completed, overdue }
  onFilterChange, // (tab) => ...
}) => {
  return (
    <div className="todo-filter-tabs">
      {FILTER_TABS.map((tab) => {
        const count = stats[tab.key];
        const isActive = filterTab === tab.key;

        // Tab "Quá hạn" chỉ hiện khi có công việc quá hạn
        if (tab.hideWhenEmpty && count === 0) {
          return null;
        }

        return (
          <button
            key={tab.key}
            type="button"
            className={`todo-filter-tab ${isActive ? 'is-active' : ''}`}
            onClick={() => onFilterChange(tab.key)}
          >
            {tab.label}
            <span
              className="todo-tab-count"
              style={tab.key === 'overdue' ? getOverdueCountStyle(isActive) : undefined}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
