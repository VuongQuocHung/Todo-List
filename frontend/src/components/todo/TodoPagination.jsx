import { ChevronLeft, ChevronRight } from 'lucide-react';

export const TodoPagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1) {
    return null;
  }

   // Hiển thị trang đầu, trang cuối và các trang gần trang hiện tại.
  const pages = [];

  for (let page = 1; page <= totalPages; page++) {
    const shouldShow =
      totalPages <= 7 || // Ít trang thì hiện tất cả
      page === 1 ||      // Luôn hiện trang đầu
      page === totalPages ||  // Luôn hiện trang cuối
      Math.abs(page - currentPage) <= 1;     // Hiện trang hiện tại và hai trang bên cạnh

    if (shouldShow) {
      const previousPage = pages[pages.length - 1];

      if (
        typeof previousPage === 'number' &&
        page - previousPage > 1
      ) {
        pages.push('...');
      }

      pages.push(page);
    }
  }

  const handlePageChange = (nextPage) => {
    if (isLoading || nextPage === currentPage || nextPage < 1 || nextPage > totalPages) {
      return;
    }

    onPageChange(nextPage);
  };

  return (
    <nav className="todo-pagination">
      <div className="todo-pagination-info">
        Trang <strong>{currentPage}</strong>
        {' / '}
        <strong>{totalPages}</strong>
      </div>

      <div className="todo-pagination-controls">
        <button
          type="button"
          className="todo-page-btn todo-page-nav"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isLoading || currentPage <= 1}>
          <ChevronLeft size={16} />
          <span>Trước</span>
        </button>

        <div className="todo-page-numbers">
          {pages.map((page, index) =>
            page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="todo-page-ellipsis"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                className={`todo-page-btn todo-page-number ${
                  page === currentPage ? 'is-active' : ''
                }`}
                onClick={() => handlePageChange(page)}
                disabled={isLoading}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          className="todo-page-btn todo-page-nav"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLoading || currentPage >= totalPages}
        >
          <span>Sau</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
};