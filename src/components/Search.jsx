import { HiSearch } from 'react-icons/hi';

function Search({
    value,
    onChange,
    placeholder = "Tìm kiếm...",
    className = "",
    inputClassName = "",
    iconClassName = ""
}) {
    return (
        <form className={`relative w-full ${className}`}>
            <HiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${iconClassName}`} />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputClassName}`}
            />
        </form>
    );
}

export default Search;