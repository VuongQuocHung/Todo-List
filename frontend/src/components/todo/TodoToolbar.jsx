import { Search } from 'lucide-react';

export const TodoToolbar = ({
  keyword, // keyword
  onKeywordChange, // setKeyword
  onSearch, // handleSearch
  onClearSearch, // handleClearSearch
  filterTab, // filterTab
  onFilterChange, // setFilterTab
  totalCount,
  pendingCount,
  completedCount, 
  overdueCount,
}) => {
  return (
    <section className="todo-toolbar">
      <form className="todo-search-bar" onSubmit={onSearch}>
        <div className="todo-search-input-wrap">
          <span className="todo-search-icon">
            <Search size={16} />
          </span>
          <input
            id="todo-search"
            className="todo-search-input"
            type="text"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            placeholder="Tìm theo tiêu đề công việc..."
          />
          {keyword && (
            <button
              type="button"
              className="todo-search-clear"
              onClick={onClearSearch}
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" className="todo-btn-search">
          Tìm kiếm
        </button>
      </form>

      <div className="todo-filter-tabs">
        <button
          type="button"
          className={`todo-filter-tab ${filterTab === 'all' ? 'is-active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          Tất cả
          <span className="todo-tab-count">{totalCount}</span>
        </button>
        <button
          type="button"
          className={`todo-filter-tab ${filterTab === 'pending' ? 'is-active' : ''}`}
          onClick={() => onFilterChange('pending')}
        >
          Chưa hoàn thành
          <span className="todo-tab-count">{pendingCount}</span>
        </button>
        <button
          type="button"
          className={`todo-filter-tab ${filterTab === 'completed' ? 'is-active' : ''}`}
          onClick={() => onFilterChange('completed')}
        >
          Đã hoàn thành
          <span className="todo-tab-count">{completedCount}</span>
        </button>
        {overdueCount > 0 && (
          <button
            type="button"
            className={`todo-filter-tab ${filterTab === 'overdue' ? 'is-active' : ''}`}
            onClick={() => onFilterChange('overdue')}
          >
            Quá hạn
            <span 
              className="todo-tab-count" 
              style={{ background: filterTab === 'overdue' ? 'rgba(255,255,255,0.3)' : '#fee2e2', color: filterTab === 'overdue' ? '#fff' : '#dc2626' }}
            >
              {overdueCount}
            </span>
          </button>
        )}
      </div>
    </section>
  )
}