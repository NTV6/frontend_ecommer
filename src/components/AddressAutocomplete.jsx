import { useState, useEffect, useRef } from 'react';

function AddressAutocomplete({ value, onChange, placeholder = "Địa chỉ" }) {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef(null);
    const debounceTimer = useRef(null);

    // Đóng dropdown khi click bên ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchAddress = async (query) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            // Sử dụng Nominatim API của OpenStreetMap
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                `format=json&` +
                `q=${encodeURIComponent(query)}&` +
                `countrycodes=vn&` +
                `addressdetails=1&` +
                `limit=5`,
                {
                    headers: {
                        'Accept-Language': 'vi'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setSuggestions(data);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onChange(e);

        // Debounce để tránh gọi API quá nhiều
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            searchAddress(newValue);
        }, 500);
    };

    const handleSelectSuggestion = (suggestion) => {
        const selectedAddress = suggestion.display_name;
        onChange({ target: { name: 'address', value: selectedAddress } });
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} className="relative">
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                rows="1"
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            {isLoading && (
                <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
            )}

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={suggestion.place_id || index}
                            type="button"
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                        >
                            <div className="text-sm text-gray-900 dark:text-white">
                                {suggestion.display_name}
                            </div>
                            {suggestion.address && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {suggestion.type === 'house' ? '🏠' :
                                        suggestion.type === 'road' ? '🛣️' :
                                            suggestion.type === 'city' ? '🏙️' : '📍'} {suggestion.type}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AddressAutocomplete;