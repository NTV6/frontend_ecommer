import { useState, useEffect } from 'react';

export const usePagination = (items = [], itemsPerPage = 9) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [paginatedItems, setPaginatedItems] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // Đảm bảo items là một mảng
        const array = Array.isArray(items) ? items : [];

        const lastItemIndex = currentPage * itemsPerPage;
        const firstItemIndex = lastItemIndex - itemsPerPage;

        setPaginatedItems(array.slice(firstItemIndex, lastItemIndex));
        setTotalPages(array.length > 0 ? Math.ceil(array.length / itemsPerPage) : 1);

        // Reset về trang 1 nếu trang hiện tại lớn hơn tổng số trang
        if (currentPage > Math.ceil(array.length / itemsPerPage)) {
            setCurrentPage(1);
        }
    }, [items, currentPage, itemsPerPage]);

    return {
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedItems,
        totalItems: Array.isArray(items) ? items.length : 0
    };
};