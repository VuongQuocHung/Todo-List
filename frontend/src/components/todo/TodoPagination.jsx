import { ChevronLeft, ChevronRight } from 'lucide-react';

const navButtonClass =
  'flex items-center gap-1 rounded bg-surface-container-low px-2 py-1 font-medium text-on-surface transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:text-outline disabled:opacity-50 disabled:hover:bg-surface-container-low';

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
    <nav
      className="flex w-full flex-col items-center justify-between gap-3 pt-1 text-xs font-medium text-on-surface-variant sm:flex-row"
      aria-label="Phân trang"
    >
      <div>
        Trang <strong className="font-semibold text-on-surface">{currentPage}</strong>
        {' / '}
        <strong className="font-semibold text-on-surface">{totalPages}</strong>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-1">
        <button
          type="button"
          className={navButtonClass}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isLoading || currentPage <= 1}>
          <ChevronLeft size={16} />
          <span>Trước</span>
        </button>

        {pages.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="w-6 text-center text-outline"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`flex h-8 w-8 items-center justify-center rounded transition-colors disabled:cursor-not-allowed ${
                page === currentPage
                  ? 'bg-primary font-semibold text-on-primary shadow-sm'
                  : 'font-medium text-on-surface hover:bg-surface-container-high'
              }`}
              onClick={() => handlePageChange(page)}
              disabled={isLoading}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          className={navButtonClass}
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