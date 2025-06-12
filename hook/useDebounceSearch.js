import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { format, parse, isValid } from 'date-fns';

export const useDebounceSearch = (
    items,
    {
        searchFields = [], // Các trường cần tìm kiếm
        filters = {}, // Các bộ lọc bổ sung
        searchConfig = {}, // Cấu hình tìm kiếm (ví dụ: có tìm theo ngày không)
        debounceTime = 300
    } = {}
) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState(filters);
    const [filteredItems, setFilteredItems] = useState(items);

    const debouncedSearch = useCallback(
        debounce((searchValue, currentItems, currentFilters) => {
            let results = [...currentItems];

            // Nếu không có điều kiện tìm kiếm và filter
            if (!searchValue && Object.values(currentFilters).every(filter => filter === 'all')) {
                setFilteredItems(currentItems);
                return;
            }

            // Tìm kiếm theo searchTerm
            if (searchValue) {
                results = results.filter(item => {
                    const value = searchValue.toLowerCase();

                    // Xử lý tìm kiếm theo ngày nếu được cấu hình
                    if (searchConfig.searchByDate && item.created_at) {
                        const itemDate = new Date(item.created_at);
                        const formattedDate = format(itemDate, 'dd/MM/yyyy');
                        const formattedDateTime = format(itemDate, 'dd/MM/yyyy HH:mm');

                        // Kiểm tra định dạng ngày giờ
                        const inputDateTime = parse(value, 'dd/MM/yyyy HH:mm', new Date());
                        if (isValid(inputDateTime)) {
                            return formattedDateTime.includes(value);
                        }

                        // Kiểm tra định dạng ngày
                        const inputDate = parse(value, 'dd/MM/yyyy', new Date());
                        if (isValid(inputDate)) {
                            return formattedDate.includes(value);
                        }
                    }

                    // Tìm theo các trường được cấu hình
                    return searchFields.some(field => {
                        const fieldValue = item[field];
                        return fieldValue?.toString().toLowerCase().includes(value);
                    });
                });
            }

            // Áp dụng các bộ lọc
            Object.entries(currentFilters).forEach(([key, value]) => {
                if (value !== 'all') {
                    results = results.filter(item => {
                        if (key === 'status') {
                            const totalStock = item.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                            return value === 'in-stock' ? totalStock > 0 : totalStock === 0;
                        }
                        if (key === 'category_id') {
                            return item[key].toString() === value.toString();
                        }
                        return item[key] === value;
                    });
                }
            });

            setFilteredItems(results);
        }, debounceTime),
        []
    );

    useEffect(() => {
        debouncedSearch(searchTerm, items, activeFilters);
        return () => debouncedSearch.cancel();
    }, [searchTerm, items, activeFilters, debouncedSearch]);

    useEffect(() => {
        setFilteredItems(items);
    }, [items]);

    return {
        searchTerm,
        setSearchTerm,
        filteredItems,
        activeFilters,
        setActiveFilters
    };
};