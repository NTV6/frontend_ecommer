// function Pagination({ currentPage, totalPages, onPageChange }) {
//   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

//   return (
//     <div className="flex justify-center space-x-2 mt-8">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white hover:text-black"
//       >
//         Trước
//       </button>

//       {pages.map(page => (
//         <button
//           key={page}
//           onClick={() => onPageChange(page)}
//           className={`px-4 py-2 border rounded-md ${currentPage === page
//               ? 'bg-gray-500 text-white'
//               : 'hover:bg-gray-100 hover:text-black'
//             }`}
//         >
//           {page}
//         </button>
//       ))}

//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className="px-4 py-2 border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white hover:text-black"
//       >
//         Sau
//       </button>
//     </div>
//   );
// }

// export default Pagination;

import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

function Pagination({ currentPage, totalPages, onPageChange, totalItems }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    let pagesToShow = [];

    if (totalPages <= 5) {
      pagesToShow = pageNumbers;
    } else {
      if (currentPage <= 3) {
        pagesToShow = [...pageNumbers.slice(0, 5), '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        pagesToShow = [1, '...', ...pageNumbers.slice(totalPages - 4)];
      } else {
        pagesToShow = [
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        ];
      }
    }

    return pagesToShow.map((number, index) => {
      if (number === '...') {
        return (
          <span
            key={`ellipsis-${index}`}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            ...
          </span>
        );
      }

      return (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium
                        ${number === currentPage
              ? 'z-10 bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
        >
          {number}
        </button>
      );
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-3 md:gap-0">
        <div className="text-sm text-gray-700 dark:text-gray-300 text-center md:text-left">
          Hiển thị <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> đến{' '}
          <span className="font-medium">
            {Math.min(currentPage * 10, totalItems)}
          </span>{' '}
          trong tổng số <span className="font-medium">{totalItems}</span> đơn hàng
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 
                    ${currentPage === 1
                ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
          >
            <HiOutlineChevronLeft className="h-5 w-5" />
          </button>

          {renderPageNumbers()}

          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 
                    ${currentPage === totalPages
                ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
          >
            <HiOutlineChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pagination;