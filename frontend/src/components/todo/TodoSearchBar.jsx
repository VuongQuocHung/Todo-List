import { useState } from 'react';
import { Search, X } from 'lucide-react';

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
    <section className="flex w-full flex-col gap-1">
      <form className="flex w-full flex-col gap-2 sm:flex-row sm:items-center" onSubmit={handleSubmit}>
        <div className="relative flex flex-1 items-center">
          <Search size={18} className="pointer-events-none absolute left-3 text-outline" />
          <input
            id="todo-search"
            className="w-full rounded-lg bg-surface-container-lowest py-2.5 pl-10 pr-9 text-on-surface shadow-sm outline-none placeholder:text-outline focus:ring-2 focus:ring-primary/20"
            type="text"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo tiêu đề công việc..."
          />
          {keyword && (
            <button
              type="button"
              className="absolute right-3 flex items-center text-outline hover:text-on-surface"
              onClick={handleClear}
              title="Xóa từ khóa"
            >
              <X size={16} />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-surface-container-high px-4 py-2.5 font-medium text-on-surface shadow-sm transition-colors hover:bg-surface-variant"
        >
          Tìm kiếm
        </button>
      </form>

      {/* Đang lọc theo từ khóa → hiện nhãn kết quả + nút xóa */}
      {searchKeyword && (
        <div className="flex items-center justify-between px-1 pt-1 text-[11px] font-semibold text-on-surface-variant">
          <span>
            Kết quả cho: <strong className="font-medium text-on-surface">“{searchKeyword}”</strong>
          </span>
          <button type="button" className="font-medium text-primary hover:underline" onClick={handleClear}>
            Xóa tìm kiếm
          </button>
        </div>
      )}
    </section>
  );
};
