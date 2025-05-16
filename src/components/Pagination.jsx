function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white hover:text-black"
      >
        Trước
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 border rounded-md ${currentPage === page
              ? 'bg-gray-500 text-white'
              : 'hover:bg-gray-100 hover:text-black'
            }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white hover:text-black"
      >
        Sau
      </button>
    </div>
  );
}

export default Pagination;