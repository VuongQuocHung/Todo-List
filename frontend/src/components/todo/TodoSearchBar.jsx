import { Search } from 'lucide-react';

export const TodoSearchBar = ({
  keyword, // chữ đang gõ
  onKeywordChange, // setKeyword
  onSearch, // handleSearch
  onClear, // handleClearSearch
}) => {
  const handleSubmit = (event) => {
    event.preventDefault(); // chặn form tải lại trang
    onSearch();
  };

  return (
    <form className="todo-search-bar" onSubmit={handleSubmit}>
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
            onClick={onClear}
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="todo-btn-search">
        Tìm kiếm
      </button>
    </form>
  );
};
