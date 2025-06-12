import { useState, useEffect } from 'react';

export const usePagination = (items, itemsPerPage = 9) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedItems, setPaginatedItems] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const lastItemIndex = currentPage * itemsPerPage;
        const firstItemIndex = lastItemIndex - itemsPerPage;

        setPaginatedItems(items.slice(firstItemIndex, lastItemIndex));
        setTotalPages(items.length > 0 ? Math.ceil(items.length / itemsPerPage) : 1);

        // Reset về trang 1 nếu trang hiện tại lớn hơn tổng số trang
        if (currentPage > Math.ceil(items.length / itemsPerPage)) {
            setCurrentPage(1);
        }
    }, [items, currentPage, itemsPerPage]);

    return {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems,
        totalItems: items.length
    };
};