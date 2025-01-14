// 페이지네이션 컴포넌트
export function Pagination({ currentPage, totalPages, onPageChange, getPageNumbers }) {
    return (
        <div className="pagination">
            <button onClick={() => onPageChange(0)} disabled={currentPage === 0}>
                첫 페이지로
            </button>
            {getPageNumbers().map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`page-number ${page === currentPage ? 'active' : ''}`}
                >
                    {page + 1}
                </button>
            ))}
            <button onClick={() => onPageChange(totalPages - 1)} disabled={currentPage === totalPages - 1}>
                마지막 페이지로
            </button>
        </div>
    );
}