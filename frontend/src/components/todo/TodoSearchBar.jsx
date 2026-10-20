import { useState } from 'react';
import { Search } from 'lucide-react';

export const TodoSearchBar = ({
  searchKeyword, // từ khóa đã tìm (ở TodoApp)
  onSearch, // (keyword) => ... gọi khi bấm Tìm
  onClear, // () => ...
}) => {
  // Chữ đang gõ chỉ ô tìm kiếm cần biết → để state ở đây
  const [keyword, setKeyword] = useState(searchKeyword);

  // Khi từ khóa bị đổi từ bên ngoài (vd bấm "Xóa tìm kiếm" ở màn hình rỗng) → đồng bộ lại ô nhập
  const [prevSearchKeyword, setPrevSearchKeyword] = useState(searchKeyword);
  if (searchKeyword !== prevSearchKeyword) {
    setPrevSearchKeyword(searchKeyword);
    setKeyword(searchKeyword);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(keyword.trim());
  };

  const handleClear = () => {
    setKeyword('');
    onClear();
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
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo tiêu đề công việc..."
        />
        {keyword && (
          <button type="button" className="todo-search-clear" onClick={handleClear}>
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
