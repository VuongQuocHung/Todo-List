// Cấu hình các tab lọc; key trùng với key trong stats từ API
const FILTER_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'pending', label: 'Chưa hoàn thành' },
  { key: 'completed', label: 'Đã hoàn thành' },
  { key: 'overdue', label: 'Quá hạn', hideWhenEmpty: true },
];

// Màu số đếm: tab đang chọn → xanh; tab "Quá hạn" → đỏ; còn lại → xám
const getCountClass = (tabKey, isActive) => {
  if (isActive) return 'bg-primary-fixed text-on-primary-fixed-variant';
  if (tabKey === 'overdue') return 'bg-error-container text-on-error-container';
  return 'bg-surface-container-high text-on-surface-variant';
};

export const TodoFilterTabs = ({
  filterTab, // tab đang chọn
  stats, // { all, pending, completed, overdue }
  onFilterChange, // (tab) => ...
}) => {
  return (
    <nav aria-label="Bộ lọc công việc" className="flex w-full items-center gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
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
            className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 font-medium transition-colors ${
              isActive
                ? 'bg-surface-container-lowest font-semibold text-primary shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-lowest hover:text-on-surface'
            }`}
            onClick={() => onFilterChange(tab.key)}
            aria-pressed={isActive}
          >
            <span>{tab.label}</span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${getCountClass(tab.key, isActive)}`}>
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
